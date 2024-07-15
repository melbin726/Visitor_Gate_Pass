// StatusBadge.jsx

import React from 'react';

const StatusBadge = ({ card }) => {
    const getStatusClass = (status) => {
        if (status === "checked_in") return "status-red";
        if (status === "checked_out") return "status-green";
        return "status-orange";
    };

    return (
        <span className={`status ${getStatusClass(card.status)}`}>
            {card.card_id}
        </span>
    );
};

export default StatusBadge;
