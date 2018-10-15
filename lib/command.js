'use strict';

const Model = require('./model.js');
const Data = require('./data.js');

const internals = {};

exports.Command = internals.Command = class Command {

    run(input) {
        throw new internals.MethodNotImplementedError("Method not implemented");
    }
};

exports.PrepareCheckout = internals.PrepareCheckout = class PrepareCheckout extends internals.Command {

    constructor(pricingRuleRepository, adTypeRepository) {
        super();
        this._pricingRuleRepository = (pricingRuleRepository ? pricingRuleRepository : new Data.PricingRuleRepository());
        this._adTypeRepository = (adTypeRepository ? adTypeRepository : new Data.AdTypeRepository());
    }

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

Object.seal(exports);
