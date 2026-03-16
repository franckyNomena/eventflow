import type { FC } from 'react'

const QuickActions: FC = () => {
    const actions = [
        { label: 'Créer un événement', icon: '➕' },
        { label: 'Voir les rapports', icon: '📊' },
        { label: 'Gérer les utilisateurs', icon: '👥' },
        { label: 'Paramètres', icon: '⚙️' }
    ]

    return (
        <div className="quick-actions">
            <h3>Actions Rapides</h3>
            <div className="actions-grid">
                {actions.map((action, index) => (
                    <button key={index} className="action-button">
                        <span className="icon">{action.icon}</span>
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default QuickActions