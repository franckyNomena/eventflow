import express from "express";
import Reservation from "../models/Reservation.js";
import Event from "../models/Event.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/reservations/all - TOUTES les réservations (ADMIN ONLY)
router.get("/all", authenticate, requireAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "name email")
      .populate("eventId", "title date location price")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
  // GET /api/reservations - Réservations de l'utilisateur connecté
  router.get("/", authenticate, async (req, res) => {
    try {
      const reservations = await Reservation.find({ userId: req.user._id })
        .populate("eventId", "title date location price")
        .sort({ createdAt: -1 });

      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
  });
});

// POST /api/reservations - Créer une réservation
router.post("/", authenticate, async (req, res) => {
  try {
    const { eventId, quantity } = req.body;

    // Validation
    if (!eventId || !quantity) {
      return res
        .status(400)
        .json({ message: "eventId et quantity sont requis" });
    }

    if (quantity < 1) {
      return res
        .status(400)
        .json({ message: "La quantité doit être au moins 1" });
    }

    // Vérifier que l'événement existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    // Vérifier disponibilité
    if (event.availableSeats < quantity) {
      return res.status(400).json({
        message: `Seulement ${event.availableSeats} places disponibles`,
      });
    }

    // Calculer prix total
    const totalPrice = event.price * quantity;

    // Générer référence unique
    const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Créer réservation
    const reservation = await Reservation.create({
      userId: req.user._id,
      eventId,
      quantity,
      totalPrice,
      reference,
      status: "confirmed",
    });

    // Décrémenter places disponibles
    event.availableSeats -= quantity;
    await event.save();

    // Retourner réservation avec infos populées
    const populatedReservation = await Reservation.findById(
      reservation._id,
    ).populate("eventId", "title date location price");

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error("Erreur création réservation:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE /api/reservations/:id - Annuler une réservation
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    // Vérifier que c'est bien la réservation de l'utilisateur (ou admin)
    if (
      reservation.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Si déjà annulée
    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Réservation déjà annulée" });
    }

    // Récupérer l'événement
    const event = await Event.findById(reservation.eventId);
    if (event) {
      // Libérer les places
      event.availableSeats += reservation.quantity;
      await event.save();
    }

    // Marquer comme annulée
    reservation.status = "cancelled";
    await reservation.save();

    res.json({ message: "Réservation annulée avec succès", reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

export default router;
