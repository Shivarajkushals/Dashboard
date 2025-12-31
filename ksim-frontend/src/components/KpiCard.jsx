import React from 'react'

const KpiCard = ({ label, value, change }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className={`kpi-change ${change >= 0 ? 'positive' : 'negative'}`}>
                {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
            </div>
        </div>
    )
}

export default KpiCard