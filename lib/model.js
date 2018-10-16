'use strict';

/**
 * An error object to be thrown when a method without a proper implementation is invoked.
 * @param {string} message an error message
 */
class MethodNotImplementedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MethodNotImplementedError';
    }
}

exports.MethodNotImplementedError = MethodNotImplementedError;

/**
 * A discount rule object to be used by a Cart
 */
class DiscountRule {
    
    /**
     * This function applies a discount rule to a Cart.
     * @param {Cart} cart a Cart object
     */
    apply(cart) {
        throw new MethodNotImplementedError("Method not implemented");
    }

    /**
     * This function calculates how many bundles there are in a set of items.
     * @param {number} itemQuantity the size of a set of items
     * @param {number} bundleSize the size of a bundle
     * @returns {number} how many bundles there are in a set of items
     */
    calcItemBundles(itemQuantity, bundleSize) {
        return Math.floor(itemQuantity / bundleSize);
    }

    /**
     * This function calculates the difference between an item's standard price and its discounted price.
     * @param {number} standardPrice an item's standard price
     * @param {number} discountedPrice an item's discounted price
     * @returns {number} the difference between an item's standard price and its discounted price or 0
     * if the standard price is lower than the discounted price
     */
    calcItemDiscountDifference(standardPrice, discountedPrice) {
        return (standardPrice < discountedPrice ? 0 : standardPrice - discountedPrice);
    }
}

exports.DiscountRule = DiscountRule;

/**
 * A discount rule object for a discount in which the customer pays for less items for each bundle there is in his Cart.
 * @param {Object} item an item with price and id 
 * @param {number} bundleSize the size of a bundle
 * @param {number} paidItemsPerBundle how many items from a bundle are paid by the customer for each bundle
 */
class ItemTypeBundleDiscountRule extends DiscountRule {

    constructor(item, bundleSize, paidItemsPerBundle) {
        super();
        this._item = item;
        this._bundleSize = bundleSize;
        this._paidItemsPerBundle = paidItemsPerBundle;
    }

    /**
     * This function applies this discount rule to a Cart.
     * @param {Cart} cart a Cart object
     */
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

exports.ItemTypeBundleDiscountRule = ItemTypeBundleDiscountRule;

/**
 * A discount rule object for a discount in which the customer pays less for a given item type.
 * @param {Object} item an item with price and id 
 * @param {number} discountedPrice the discounted price of an item
 */
class PerItemTypeDiscount extends DiscountRule {

    constructor(item, discountedPrice) {
        super();
        this._item = item;
        this._discountedPrice = discountedPrice;
    }

    /**
     * This function applies this discount rule to a Cart.
     * @param {Cart} cart a Cart object
     */
    apply(cart) {
        const itemCount = cart.count(this._item.id);

        if (itemCount < 1) {
            return;
        }

        const itemDiscountDifference = this.calcItemDiscountDifference(this._item.price, this._discountedPrice);
        cart.applyAbsoluteDiscount(itemDiscountDifference * itemCount);
    }
}

exports.PerItemTypeDiscount = PerItemTypeDiscount;

/**
 * A discount rule object for a discount in which the customer pays less for a given item type
 * once he has enough items of such type to exceed a specified threshold.
 * @param {Object} item an item with price and id 
 * @param {number} threshold the threshold that activates this discount once reached
 * @param {number} discountedPrice the discounted price of an item
 */
class ItemTypePastThresholdDiscountRule extends DiscountRule {

    constructor(item, threshold, discountedPrice) {
        super();
        this._item = item;
        this._threshold = threshold;
        this._discountedPrice = discountedPrice;
    }

    /**
     * This function applies this discount rule to a Cart.
     * @param {Cart} cart a Cart object
     */
    apply(cart) {
        const itemCount = cart.count(this._item.id);

        if (itemCount < this._threshold) {
            return;
        }

        const itemDiscountDifference = this.calcItemDiscountDifference(this._item.price, this._discountedPrice);
        cart.applyAbsoluteDiscount(itemDiscountDifference * itemCount);
    }
}

exports.ItemTypePastThresholdDiscountRule = ItemTypePastThresholdDiscountRule;

/**
 * A Cart object that holds all items to be purchased by a customer.
 * @param items an array of items with price and id
 */
class Cart {

    constructor(items) {
        this._items = items ? items : {};
        this.resetDiscounts();
    }

    /**
     * This function returns a deep copy of the discount rule objects used by this Cart.
     * @returns an array containing the discount rule objects used by this Cart
     */
    get discounts() {
        return JSON.parse(JSON.stringify(this._discounts));
    }

    /**
     * This function adds an item to the Cart.
     * @param {Object} item an item with price and id 
     */
    add(item) {
        const existingItem = this._items[item.id];

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = { price: item.price, quantity: 1};
            this._items[item.id] = newItem;
        }
    }

    /**
     * This function returns the count of items of a given type/id.
     * @param {string} itemName the type/id of an item (can be null/undefined)
     * @return count of items of a given type/id or the total count of items
     * from the cart if no itemName was specified
     */
    count(itemName) {
        if (!itemName) {
            return Object.keys(this._items).reduce(
                ((accumulator, item) => accumulator + this._items[item].quantity), 0
            );
        }

        const item = this._items[itemName];
        return item ? item.quantity : 0;
    }

    /**
     * This function adds an absolute discount that will be used to compute the 
     * Cart's total, with multiple invocations resulting in absolute discounts being
     * stacked.
     * @param {number} discount the absolute discount to be applied
     */
    applyAbsoluteDiscount(discount) {
        this._discounts.absolute += discount;
    }

    /**
     * This function adds a relative discount that will be used to compute the 
     * Cart's total, with multiple invocations resulting in relative discounts being
     * stacked.
     * @param {number} discount the relative discount to be applied
     */
    applyRelativeDiscount(discount) {
        this._discounts.relative += discount;
    }

    /**
     * This function resets all discounts to be applied to this Cart.
     */
    resetDiscounts() {
        this._discounts = { absolute: 0, relative: 0 };
    }

    /**
     * This function returns the total of this Cart without computing discounts.
     * @returns {number} the total of this Cart without computing discounts
     */
    totalWithoutDiscounts() {
        return Object.keys(this._items).reduce(
            ((accumulator, item) => {
                const itemObject = this._items[item];
                return accumulator += itemObject.price * itemObject.quantity    
            }), 0
        );
    }

    /**
     * This function returns the total of this Cart after applying all discounts.
     * @returns {number} the total of this Cart after applying all discounts
     */
    total() {
        return (this.totalWithoutDiscounts() - this._discounts.absolute) * (1 - (this._discounts.relative / 100))
    }
}

exports.Cart = Cart;

/**
 * A Checkout object that acts as an aggregate root of the domain.
 * @param {[DiscountRule]} pricingRules an array of DiscountRules
 * @param {Cart} cart a Cart
 */
class Checkout {

    constructor(pricingRules, cart) {
        this._pricingRules = (pricingRules ? pricingRules : []);
        this._cart = (cart ? cart : new Cart());
    }

    /**
     * This function adds an item to a Cart.
     * @param {Object} item an item with price and id 
     */
    add(item) {
        this._cart.add(item);
    }

    /**
     * This function returns the total of a Cart after applying all discount rules.
     * @returns {number} the total of a Cart after applying all discount rules
     */
    total() {
        this._cart.resetDiscounts();

        this._pricingRules.forEach(
            discount => discount.apply(this._cart)
        );

        return this._cart.total();
    }
}

exports.Checkout = Checkout;

Object.seal(exports);