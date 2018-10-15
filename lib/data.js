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

exports.AdTypeRepository = internals.AdTypeRepository = class AdTypeRepository {
   
    findAll() {
        return [
            internals.adTypes.classic, 
            internals.adTypes.standout, 
            internals.adTypes.premium
        ]
    }

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

exports.PricingRuleRepository = internals.PricingRuleRepository = class PricingRuleRepository {

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

Object.seal(exports);
