import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {formatText} from "../utils/Utils";
import {NOTE_SERVICES_DEMO, NOTE_SERVICES_PRICES} from "../utils/Constant";

const defaultCurrency = 'USD';

function ServicePricing({ pricing }) {
    if (!pricing) {
        return <span>Individual estimate</span>;
    }

    const { useFrom, ...currencies } = pricing;
    const selectedCurrency = currencies[defaultCurrency];

    if (useFrom && selectedCurrency) {
        return (<span key={defaultCurrency}>Estimated from {defaultCurrency} {selectedCurrency.from}<br /></span>);
    }

    return Object.entries(currencies).map(([currency, value]) => {
        return (<span key={currency}>Estimated {currency}: {value.from}-{value.to}<br /></span>);
    });
}

function Services({ data }) {
    return (
        <main>
            <h1 className='page-header'>Services</h1>
            <div id='services' className='section'>
                <div className='note-card'>
                    <p>{formatText(NOTE_SERVICES_DEMO)}</p>
                </div>
                <table className='services-table'>
                    <thead>
                    <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th className='service-price mobile-hidden'>Estimated Price</th>
                        <th className='service-contact mobile-hidden'>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map(s =>
                            <tr id={s.serviceId} key={s.serviceId}>
                                <td width='25%' className='service-name'>{s.name}</td>
                                <td width='45%' className='service-description'>{s.description}</td>
                                <td width='25%' className='service-price mobile-hidden'>
                                    <ServicePricing pricing={s.pricing} />
                                </td>
                                <td width='5%' className='service-contact mobile-hidden'>
                                    <Link className="btn btn-light" to='/contact#contactForm'>Contact</Link>
                                </td>
                            </tr>)
                    }
                    </tbody>
                </table>
                <div className='services-mobile-list'>
                    {data.map(s => (
                        <article id={`${s.serviceId}-card`} className='service-card' key={`${s.serviceId}-card`}>
                            <h2>{s.name}</h2>
                            <p>{s.description}</p>
                            <div className='service-card-price'>
                                <ServicePricing pricing={s.pricing} />
                            </div>
                            <Link className="btn btn-primary" to='/contact#contactForm'>Contact</Link>
                        </article>
                    ))}
                </div>
                <div className='note-card'>
                    <p>{formatText(NOTE_SERVICES_PRICES)}</p>
                </div>
            </div>
        </main>
    );
}

ServicePricing.propTypes = {
  pricing: PropTypes.shape({
    useFrom: PropTypes.bool,
    USD: PropTypes.shape({
      from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    EUR: PropTypes.shape({
      from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    PLN: PropTypes.shape({
      from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

Services.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      serviceId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      pricing: ServicePricing.propTypes.pricing,
    })
  ).isRequired,
};

export default Services;
