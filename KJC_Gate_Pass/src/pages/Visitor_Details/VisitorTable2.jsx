import React, { useState } from 'react';
import './VisitorTable2.css';
import dropdown_logo from '../../assets/Icons/dropdown_logo.svg';
import profile from '../../assets/profile.svg';

const VisitorTable2 = ({ visitors }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (index) => {
        const isRowExpanded = expandedRows.includes(index);
        if (isRowExpanded) {
            setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };

    return (
        <div className="vt_table-container">
            <table className="vt_visitor-table">
                <thead>
                    <tr className='tr'>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Check-in Time</th>
                        <th>Check-out Time</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {visitors.map((visitor, index) => (
                        <React.Fragment key={index}>
                            <tr onClick={() => toggleRow(index)} className="vt_table-row">
                                <td>{visitor.name}</td>
                                <td>{visitor.phone_number}</td>
                                <td>{visitor.check_in_time || 'N/A'}</td>
                                <td>{visitor.check_out_time || 'N/A'}</td>
                                <td className='logoclass'>
                                    Details
                                    <div className={`dropdown-icon ${expandedRows.includes(index) ? 'rotated' : ''}`}>
                                        <img src={dropdown_logo} alt="Dropdown" />
                                    </div>
                                </td>
                            </tr>
                            {expandedRows.includes(index) && (
                                <tr className="expanded-row">
                                    <td className="vt_tdclass" colSpan="6">
                                        <div className='vt_tabledetails'>
                                            <div className="vt_main-section-form">
                                                <div className="vt_left-section-form">
                                                    <div className='vt_sessiondetail'><b>Purpose of Visit:</b> {visitor.purpose_of_visit}</div>
                                                    <div className='vt_sessiondetail'><b>Entry Gate:</b> {visitor.entry_gate}</div>
                                                    <div className='vt_sessiondetail'><b>Check-In Time:</b> {visitor.check_in_time}</div>
                                                    <div className='vt_sessiondetail'><b>Exit Gate:</b> {visitor.exit_gate}</div>
                                                    <div className='vt_sessiondetail'><b>Check-out Time:</b> {visitor.check_out_time}</div>
                                                    <div className='vt_sessiondetail'><b>Group Size:</b> {visitor.group_size}</div>
                                                   
                                                    <div className='vt_sessiondetail'>
                                                        <b>Card Id</b>:&nbsp;&nbsp;{visitor.visitor_cards.map(card => card.card_id).join(', ')}
                                                    </div>
                                                </div>

                                                <div className="vt_separator"></div>

                                                <div className="vt_center-section-form">
                                                    {visitor.visitor_cards.length > 0 ? (
                                                        visitor.visitor_cards.map((card, cardIndex) => (
                                                            <div key={cardIndex} className='vt_Groupcard1'>
                                                                <div className='vt_card'>
                                                                    <div className='vt_card_details'>
                                                                        <b>Card ID:</b> {card.card_id}
                                                                    </div>
                                                                    <div className='vt_card_details'>
                                                                        <b>Exit Gate:</b> {card.exit_gate || 'N/A'}
                                                                    </div>
                                                                    <div className='vt_card_details'>
                                                                        <b>Check-out Time:</b> {card.check_out_time || 'N/A'}
                                                                    </div>
                                                                    <div className='vt_card_details'>
                                                                        <b>Status:</b> {card.status}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p>No group members found.</p>
                                                    )}
                                                </div>

                                                <div className="vt_separator"></div>
                                                
                                                <div className="vt_right-section-formm">
                                                    <div className='image_container'>
                                                        {visitor.photos ? (
                                                            <img src={visitor.photos} className='visitorDetails_image_container' alt="Profile" />
                                                        ) : (
                                                            <img src={profile} className='visitorDetails_image_container' alt="Default Profile" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VisitorTable2;
