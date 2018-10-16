'use strict';

const Model = require('./model.js');
const deepFreeze = require('deep-freeze');

const internals = {};

internals.adTypes = {
    classic: { id: 'classic', name: 'Classic Ad', price: '269.99' },
    standout: { id: 'standout', name: 'Standout Ad', price: '322.99' },
    premium: { id: 'premium', name: 'Premium Ad', price: '394.99' }
};

deepFreeze(internals.adTypes);

/**
 * A repository for ad types.
 */
class AdTypeRepository {
   
    /**
     * This function returns all available ad types.
     * @returns {[Object]} an array containing all available ad types
     */
    findAll() {
        return [
            internals.adTypes.classic, 
            internals.adTypes.standout, 
            internals.adTypes.premium
        ]
    }

    /**
     * This function returns an ad type for a given ad type id.
     * @param {string} id the id of an ad type
     * @returns {Object} an ad type object that matches the specified id
     */
    findById(id) {
        switch (id) {
            case 'classic':
                return internals.adTypes.classic;
            case 'standout':
                return internals.adTypes.standout;
            case 'premium':
                return internals.adTypes.premium;
            default:
                return undefined;
        }
    }
};

exports.AdTypeRepository = AdTypeRepository;

/**
 * A repository for pricing rules.
 */
class PricingRuleRepository {

    /**
     * This function returns all pricing rules that are associated with a given customer.
     * @param {string} customerId the id of a customer
     * @returns {[DiscountRule]} an array of DiscountRules associated with the specified customer
     */
    findByCustomerId(customerId) {
        switch(customerId) {
            case 'Unilever':
                return [
                    new Model.ItemTypeBundleDiscountRule(internals.adTypes.classic, 3, 2)
                ];
                break;
            case 'Apple':
                return [
                    new Model.PerItemTypeDiscount(internals.adTypes.standout, 299.99)
                ];
                break;
            case 'Nike':
                return [
                    new Model.ItemTypePastThresholdDiscountRule(internals.adTypes.premium, 4, 379.99)
                ];
                break;
            case 'Ford':
                return [
                    new Model.ItemTypeBundleDiscountRule(internals.adTypes.classic, 5, 4),
                    new Model.PerItemTypeDiscount(internals.adTypes.standout, 309.99),
                    new Model.ItemTypePastThresholdDiscountRule(internals.adTypes.premium, 3, 389.99)
                ];
                break;
            default:
                return [];
        }
    }
};

exports.PricingRuleRepository = PricingRuleRepository;

Object.seal(exports);
