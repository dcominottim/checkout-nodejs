'use strict';

const Model = require('../lib/model.js');
const deepFreeze = require('deep-freeze');

const fixtures = {
    adTypes: {
        standard: {
            id: 'standard',
            price: '10'
        }
    }
}

deepFreeze(fixtures);

test('DiscountRule#apply should throw an error when not overriden', () => {
    expect(() => {
        new Model.DiscountRule().apply(new Model.Cart());
    }).toThrow(Model.MethodNotImplementedError);
});

test('DiscountRule#calcItemBundles should return 0 for 2 items and a bundle size of 3', () => {
    expect(
        new Model.DiscountRule().calcItemBundles(2, 3)
    ).toBe(0);
});

test('DiscountRule#calcItemBundles should return 1 for 5 items and a bundle size of 3', () => {
    expect(
        new Model.DiscountRule().calcItemBundles(5, 3)
    ).toBe(1);
});

test('DiscountRule#calcItemBundles should return 2 for 6 items and a bundle size of 3', () => {
    expect(
        new Model.DiscountRule().calcItemBundles(6, 3)
    ).toBe(2);
});

test('DiscountRule#calcItemDiscountDifference should return 20.50 for a standardPrice of 50 and a discountedPrice of 29.50', () => {
    expect(
        new Model.DiscountRule().calcItemDiscountDifference(50, 29.50)
    ).toBe(20.50);
});

test('DiscountRule#calcItemDiscountDifference should return 0 for a standardPrice of 50 and a discountedPrice of 51', () => {
    expect(
        new Model.DiscountRule().calcItemDiscountDifference(50, 51)
    ).toBe(0);
});

test('ItemTypeBundleDiscountRule#apply should do nothing when item count is < 1', () => {
    const rule = new Model.ItemTypeBundleDiscountRule({}, 3, 2);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 0) 
        };

    rule.apply(cart);

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(0);
});

test('ItemTypeBundleDiscountRule#apply should do nothing when bundle count is < 1', () => {
    const rule = new Model.ItemTypeBundleDiscountRule({}, 3, 2);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 2) 
        };

    rule.apply(cart);

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(0);
});

test('ItemTypeBundleDiscountRule#apply should apply an absolute discount of 50 when bundle count is 1', () => {
    const rule = new Model.ItemTypeBundleDiscountRule({ price: 50 }, 3, 2);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 3) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(50);
});

test('ItemTypeBundleDiscountRule#apply should apply an absolute discount of 100 when bundle count is 2', () => {
    const rule = new Model.ItemTypeBundleDiscountRule({ price: 50 }, 3, 2);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 6) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(100);
});

test('PerItemTypeDiscount#apply should do nothing when item count is < 1', () => {
    const rule = new Model.PerItemTypeDiscount({ price: 70 }, 50);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 0) 
        };

    rule.apply(cart);

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(0);
});

test('PerItemTypeDiscount#apply should apply an absolute discount of 20 whem item count equals 1', () => {
    const rule = new Model.PerItemTypeDiscount({ price: 70 }, 50);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 1) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(20);
});

test('PerItemTypeDiscount#apply should apply an absolute discount of 40 whem item count equals 2', () => {
    const rule = new Model.PerItemTypeDiscount({ price: 70 }, 50);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 2) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(40);
});

test('ItemTypePastThresholdDiscountRule#apply should do nothing when item count is below threshold', () => {
    const rule = new Model.ItemTypePastThresholdDiscountRule({ price: 70 }, 2, 50);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 1) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(0);
});

test('ItemTypePastThresholdDiscountRule#apply should apply an absolute discount of 20 when item count equals threshold with 2 items', () => {
    const rule = new Model.ItemTypePastThresholdDiscountRule({ price: 70 }, 2, 60);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 2) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(20);
});

test('ItemTypePastThresholdDiscountRule#apply should apply an absolute discount of 30 when item count exceeds threshold with 3 items', () => {
    const rule = new Model.ItemTypePastThresholdDiscountRule({ price: 70 }, 2, 60);

    const cart = 
        { 
            applyAbsoluteDiscount: jest.fn(), 
            count: jest.fn(() => 3) 
        };

    rule.apply(cart);   

    expect(cart.applyAbsoluteDiscount).toHaveBeenCalledTimes(1);
    expect(cart.applyAbsoluteDiscount.mock.calls[0][0]).toBe(30);
});

test('Cart#count without arguments should return 0 when the item count equals 0', () => {
    const cart = new Model.Cart();

    expect(cart.count()).toBe(0);
});

test('Cart#count without arguments should return 1 when the item count equals 1', () => {
    const cart = new Model.Cart({ item1: { quantity: 1} });
    
    expect(cart.count()).toBe(1);
});

test('Cart#count without arguments should return 3 when the item count equals 3', () => {
    const cart = new Model.Cart({ item1: { quantity: 2 }, item2: { quantity: 1} });
    
    expect(cart.count()).toBe(3);
});

test('Cart#count with arguments should return 0 when the specified item´s count equals 0', () => {
    const cart = new Model.Cart({ item2 : {} });

    expect(cart.count('item1')).toBe(0);
});

test('Cart#count with arguments should return 1 when the specified item´s count equals 1', () => {
    const cart = new Model.Cart({ item1: { quantity: 1 } });

    expect(cart.count('item1')).toBe(1);
});

test('Cart#count with arguments should return 2 when the specified item´s count equals 2', () => {
    const cart = new Model.Cart({ item1: { quantity: 2 } });

    expect(cart.count('item1')).toBe(2);
});

test('Cart#add should add an item with quantity 1 for a new item', () => {
    const cart = new Model.Cart();

    cart.add({ id: 'item1'})

    expect(cart.count('item1')).toBe(1);
});

test('Cart#add should increment the specified item´s quantity by 1 for an existing item', () => {
    const cart = new Model.Cart({ item1: {quantity: 1} });

    cart.add({ id: 'item1'})

    expect(cart.count('item1')).toBe(2);
});

test('Cart should have its absolute discount value set to 0 by default', () => {
    const cart = new Model.Cart();

    expect(cart.discounts.absolute).toBe(0);
});

test('Cart should have its relative discount value set to 0 by default', () => {
    const cart = new Model.Cart();

    expect(cart.discounts.relative).toBe(0);
});

test('Cart#discounts should return an object wherein changes do not affect Cart´s internal state', () => {
    const cart = new Model.Cart();

    const discounts = cart.discounts;
    discounts.absolute = 1;

    expect(cart.discounts.absolute).toBe(0);
});

test('Cart#applyAbsoluteDiscount should set the absolute discount value to 10 when invoked for the first time with 10 as argument', () => {
    const cart = new Model.Cart();

    cart.applyAbsoluteDiscount(10);

    expect(cart.discounts.absolute).toBe(10);
});

test('Cart#applyAbsoluteDiscount should set the absolute discount value to 20 when invoked for the second time with 10 as argument', () => {
    const cart = new Model.Cart();

    cart.applyAbsoluteDiscount(10);
    cart.applyAbsoluteDiscount(10);

    expect(cart.discounts.absolute).toBe(20);
});

test('Cart#applyRelativeDiscount should set the relative discount value to 10 when invoked for the first time with 10 as argument', () => {
    const cart = new Model.Cart();

    cart.applyRelativeDiscount(10);

    expect(cart.discounts.relative).toBe(10);
});

test('Cart#applyRelativeDiscount should set the relative discount value to 20 when invoked for the second time with 10 as argument', () => {
    const cart = new Model.Cart();

    cart.applyRelativeDiscount(10);
    cart.applyRelativeDiscount(10);

    expect(cart.discounts.relative).toBe(20);
});

test('Cart#resetDiscounts should set the absolute and relative discount values to 0', () => {
    const cart = new Model.Cart();

    cart.applyAbsoluteDiscount(10);
    cart.applyRelativeDiscount(10);
    cart.resetDiscounts();

    expect(cart.discounts.absolute).toBe(0);
    expect(cart.discounts.relative).toBe(0);
});

test('Cart#totalWithoutDiscounts should return 0 when the cart is empty', () => {
    const cart = new Model.Cart();

    expect(cart.totalWithoutDiscounts()).toBe(0);
});

test('Cart#totalWithoutDiscounts should return 50 when the cart has 2 items of price 25 and no discounts', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );

    expect(cart.totalWithoutDiscounts()).toBe(50);
});

test('Cart#totalWithoutDiscounts should return 50 when the cart has 2 items of price 25 and both absolute and relative discounts set', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );

    cart.applyAbsoluteDiscount(10);
    cart.applyRelativeDiscount(10);
    
    expect(cart.totalWithoutDiscounts()).toBe(50);
});

test('Cart#total should return 0 when the cart is empty', () => {
    const cart = new Model.Cart();

    expect(cart.total()).toBe(0);
});

test('Cart#total should return 50 when the cart has 2 items of price 25 and no discounts', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );
    
    expect(cart.total()).toBe(50);
});

test('Cart#total should return 30 when the cart has 2 items of price 25 and an absolute discount of 20', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );

    cart.applyAbsoluteDiscount(20);
    
    expect(cart.total()).toBe(30);
});

test('Cart#total should return 40 when the cart has 2 items of price 25 and a relative discount of 20', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );

    cart.applyRelativeDiscount(20);
    
    expect(cart.total()).toBe(40);
});

test('Cart#total should return 36 when the cart has 2 items of price 25 and an absolute discount of 10 and a relative discount of 10', () => {
    const cart = new Model.Cart(
        { 
            item1: { quantity: 1, price: 25 }, 
            item2: { quantity: 1, price: 25 } 
        }
    );

    cart.applyAbsoluteDiscount(10);
    cart.applyRelativeDiscount(10);
    
    expect(cart.total()).toBe(36);
});

test('Checkout#add should invoke Cart#add', () => {
    const cart = 
        { 
            add: jest.fn()
        };

    const checkout = new Model.Checkout([], cart); 

    checkout.add(fixtures.adTypes.standard);
    
    expect(cart.add).toHaveBeenCalledTimes(1);
    expect(cart.add.mock.calls[0][0]).toBe(fixtures.adTypes.standard);
});

test('Checkout#total should return the total value without discounts when no pricing rules are passed', () => {
    const mockedTotal = 100;

    const cart = 
        { 
            total: jest.fn(() => mockedTotal),
            resetDiscounts: jest.fn()
        };


    const checkout = new Model.Checkout([], cart); 

    const total = checkout.total();
    
    expect(cart.resetDiscounts).toHaveBeenCalledTimes(1);
    expect(cart.total).toHaveBeenCalledTimes(1);
    expect(total).toBe(mockedTotal);
});

test('Checkout#total should return the total value with discounts according to the passed pricing rules', () => {
    const pricingRules = 
        [
            {
                apply: jest.fn()
            },
            {
                apply: jest.fn()
            }
        ];

    const mockedTotal = 100;

    const cart = 
        { 
            total: jest.fn(() => mockedTotal),
            resetDiscounts: jest.fn()
        };


    const checkout = new Model.Checkout(pricingRules, cart); 

    const total = checkout.total();
    
    expect(cart.resetDiscounts).toHaveBeenCalledTimes(1);
    expect(pricingRules[0].apply.mock.calls[0][0]).toBe(cart);
    expect(pricingRules[1].apply.mock.calls[0][0]).toBe(cart);
    expect(cart.total).toHaveBeenCalledTimes(1);
    expect(total).toBe(mockedTotal);
});