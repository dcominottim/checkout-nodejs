'use strict';

const internals = {};

exports.MethodNotImplementedError = internals.MethodNotImplementedError = class MethodNotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MethodNotImplementedError';
    }
}

exports.DiscountRule = internals.DiscountRule = class DiscountRule {
    
    apply(cart) {
        throw new internals.MethodNotImplementedError("Method not implemented");
    }

    calcItemBundles(itemQuantity, bundleSize) {
        return Math.floor(itemQuantity / bundleSize);
    }

    calcItemDiscountDifference(standardPrice, discountedPrice) {
        return (standardPrice < discountedPrice ? 0 : standardPrice - discountedPrice);
    }
}

exports.ItemTypeBundleDiscountRule = internals.ItemTypeBundleDiscountRule = class ItemTypeBundleDiscountRule extends internals.DiscountRule {

    constructor(item, bundleSize, paidItemsPerBundle) {
        super();
        this._item = item;
        this._bundleSize = bundleSize;
        this._paidItemsPerBundle = paidItemsPerBundle;
    }

    apply(cart) {
        const itemCount = cart.count(this._item.id);

        if (itemCount < 1) {
            return;
        }

        const bundles = this.calcItemBundles(itemCount, this._bundleSize);

        if (bundles > 0) {
            cart.applyAbsoluteDiscount(
                this._item.price * bundles * (this._bundleSize - this._paidItemsPerBundle)
            );
        }
    }
}

exports.PerItemTypeDiscount = internals.PerItemTypeDiscount = class PerItemTypeDiscount extends internals.DiscountRule {

    constructor(item, discountedPrice) {
        super();
        this._item = item;
        this._discountedPrice = discountedPrice;
    }

    apply(cart) {
        const itemCount = cart.count(this._item.id);

        if (itemCount < 1) {
            return;
        }

        const itemDiscountDifference = this.calcItemDiscountDifference(this._item.price, this._discountedPrice);
        cart.applyAbsoluteDiscount(itemDiscountDifference * itemCount);
    }
}

exports.ItemTypePastThresholdDiscountRule = internals.ItemTypePastThresholdDiscountRule = class ItemTypePastThresholdDiscountRule extends internals.DiscountRule {

    constructor(item, threshold, discountedPrice) {
        super();
        this._item = item;
        this._threshold = threshold;
        this._discountedPrice = discountedPrice;
    }

    apply(cart) {
        const itemCount = cart.count(this._item.id);

        if (itemCount < this._threshold) {
            return;
        }

        const itemDiscountDifference = this.calcItemDiscountDifference(this._item.price, this._discountedPrice);
        cart.applyAbsoluteDiscount(itemDiscountDifference * itemCount);
    }
}

exports.Cart = internals.Cart = class Cart {

    constructor(items) {
        this._items = items ? items : {};
        this.resetDiscounts();
    }

    get discounts() {
        return JSON.parse(JSON.stringify(this._discounts));
    }

    add(item) {
        const existingItem = this._items[item.id];

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = { price: item.price, quantity: 1};
            this._items[item.id] = newItem;
        }
    }

    count(itemName) {
        if (!itemName) {
            return Object.keys(this._items).reduce(
                ((accumulator, item) => accumulator + this._items[item].quantity), 0
            );
        }

        const item = this._items[itemName];
        return item ? item.quantity : 0;
    }

    applyAbsoluteDiscount(discount) {
        this._discounts.absolute += discount;
    }

    applyRelativeDiscount(discount) {
        this._discounts.relative += discount;
    }

    resetDiscounts() {
        this._discounts = { absolute: 0, relative: 0 };
    }

    totalWithoutDiscounts() {
        return Object.keys(this._items).reduce(
            ((accumulator, item) => {
                const itemObject = this._items[item];
                return accumulator += itemObject.price * itemObject.quantity    
            }), 0
        );
    }

    total() {
        return (this.totalWithoutDiscounts() - this._discounts.absolute) * (1 - (this._discounts.relative / 100))
    }
}

exports.Checkout = internals.Checkout = class Checkout {

    constructor(pricingRules, cart) {
        this._pricingRules = (pricingRules ? pricingRules : []);
        this._cart = (cart ? cart : new internals.Cart());
    }

    add(item) {
        this._cart.add(item);
    }

    total() {
        this._cart.resetDiscounts();

        this._pricingRules.forEach(
            discount => discount.apply(this._cart)
        );

        return this._cart.total();
    }
}

Object.seal(exports);