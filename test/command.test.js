'use strict';

const Command = require('../lib/command.js');

const internals = {};

internals.ads = {
    classic: { id: 'classic' },
    standout: { id: 'standout' },
    premium: { id: 'premium' }
};

internals.cloneAd = function(adId, times) {
    const ads = [times];

    var i;
    for (i = 0; i < times; i++) {
        ads[i] = Object.assign({}, internals.ads[adId]);
    }

    return ads;
};

test('UseCase#run should throw an error when not overriden', () => {
    expect(() => {
        new Command.PrepareCheckout().run({});
    }).toThrow(Command.MethodNotImplementedError);
});

test('PrepareCheckout#run should return 987.97 for default customer', () => {
    const prepareCheckout = new Command.PrepareCheckout();

    const input = 
        { 
            customerId: 'default',
            cart: {
                ads: [
                    internals.ads.classic,
                    internals.ads.standout,
                    internals.ads.premium
                ]
            }
        };

    const total = prepareCheckout.run(input);

    expect(total).toBe(987.97);
});

test('PrepareCheckout#run should return 934.97 for Unilever customer', () => {
    const prepareCheckout = new Command.PrepareCheckout();

    const input = 
        { 
            customerId: 'Unilever',
            cart: {
                ads: 
                    internals.cloneAd(internals.ads.classic.id, 3)
                    .concat(
                        internals.cloneAd(internals.ads.premium.id, 1)
                    )
            }
        };

    const total = prepareCheckout.run(input);

    expect(total).toBe(934.97);
});

test('PrepareCheckout#run should return 1294.96 for Apple customer', () => {
    const prepareCheckout = new Command.PrepareCheckout();

    const input = 
        { 
            customerId: 'Apple',
            cart: {
                ads: 
                    internals.cloneAd(internals.ads.standout.id, 3)
                    .concat(
                        internals.cloneAd(internals.ads.premium.id, 1)
                    )
            }
        };

    const total = prepareCheckout.run(input);

    expect(total).toBe(1294.96);
});

test('PrepareCheckout#run should return 1519.96 for Nike customer', () => {
    const prepareCheckout = new Command.PrepareCheckout();

    const input = 
        { 
            customerId: 'Nike',
            cart: {
                ads: 
                    internals.cloneAd(internals.ads.premium.id, 4)       
            }
        };

    const total = prepareCheckout.run(input);

    expect(total).toBe(1519.96);
});

test('PrepareCheckout#run should return 2909.91 for Ford customer', () => {
    const prepareCheckout = new Command.PrepareCheckout();

    const input = 
        { 
            customerId: 'Ford',
            cart: {
                ads: 
                    internals.cloneAd(internals.ads.premium.id, 3)
                    .concat(
                        internals.cloneAd(internals.ads.standout.id, 3)
                    ) 
                    .concat(
                        internals.cloneAd(internals.ads.classic.id, 3)
                    ) 
            }
        };

    const total = prepareCheckout.run(input);

    expect(total).toBe(2909.91);
});
