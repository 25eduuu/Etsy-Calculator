((root) => {
  function calculateOrder(input) {
    const price = input.price * (1 - Math.min(100, input.discount) / 100);
    const shipping = input.shipping, gift = input.gift, gross = price + shipping + gift;
    const transaction = gross * input.transaction / 100;
    const processing = gross > 0 ? gross * input.processing / 100 + input.fixed : 0;
    const regulatory = gross * input.regulatory / 100;
    const offsite = gross * input.offsite / 100;
    const listing = input.listing;
    const vatFactor = input.vatOnFees ? 1 + input.feeVat / 100 : 1;
    const vat = (transaction + processing + regulatory + offsite + listing) * (vatFactor - 1);
    const costs = input.cogs + input.postage + input.other;
    const net = gross - transaction - processing - regulatory - offsite - listing - vat - costs;
    const margin = gross > 0 ? net / gross * 100 : 0;
    const variable = (input.transaction + input.processing + input.regulatory + input.offsite) / 100 * vatFactor;
    const fixed = (input.fixed + listing) * vatFactor + costs;
    const discountFactor = 1 - Math.min(100, input.discount) / 100;
    const breakEven = variable < 1 && discountFactor > 0
      ? Math.max(0, (fixed / (1 - variable) - shipping - gift) / discountFactor)
      : 0;
    return {gross,transaction,processing,regulatory,offsite,listing,vat,costs,net,margin,breakEven};
  }
  root.calculateOrder = calculateOrder;
  if (typeof module !== 'undefined' && module.exports) module.exports = calculateOrder;
})(globalThis);
