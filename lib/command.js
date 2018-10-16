'use strict';

const Model = require('./model.js');
const Data = require('./data.js');

/**
 * An object that represents a command able to alter the state of the system.
 */
class Command {

    /**
     * This function triggers the business logic from this Command.
     * @param {Object} input an object used as input
     */
    run(input) {
        throw new Model.MethodNotImplementedError("Method not implemented");
    }
};

exports.Command = Command;

/**
 * A Command that prepares the checkout process for a customer.
 * @param {PricingRuleRepository} pricingRuleRepository a PricingRuleRepository
 * @param {AdTypeRepository} adTypeRepository an AdTypeRepository
 */
class PrepareCheckout extends Command {

    constructor(pricingRuleRepository, adTypeRepository) {
        super();
        this._pricingRuleRepository = (pricingRuleRepository ? pricingRuleRepository : new Data.PricingRuleRepository());
        this._adTypeRepository = (adTypeRepository ? adTypeRepository : new Data.AdTypeRepository());
    }

    /**
     * This function returns the total of a customer's Cart with all
     * associated pricing rules having been applied.
     * @param {Object} input an object with customerId and cart.ads
     * @returns the total of a customer's Cart with all
     * associated pricing rules having been applied
     */
    run(input) {
        const pricingRules = this._pricingRuleRepository.findByCustomerId(input.customerId);
        const adTypes = this._adTypeRepository.findAll();

        const checkout = new Model.Checkout(pricingRules);

        input.cart.ads.forEach(
            ad => checkout.add(
                adTypes.filter(adType => adType.id === ad.id)[0]
            )
        );

        return checkout.total();
    }
};

exports.PrepareCheckout = PrepareCheckout;

Object.seal(exports);
