window.citiConfig = (function() {
    'use strict';

    var endPointHost = "../../../../js/mock-endpoints/";
    var categoryEndPointPath = "mock-category-brands/alphabetical/";
    var productListingEndPointPath = "mock-product-listing/";
    var searchResultsEndPointPath = "mock-search/";
    var mfaEndPointPath = "mock-mfa/";
    var pointsTransferDetailEndPointPath = "mock-points-transfer-detail/";
    var handlebarTemplatesDir = '../../../../templates.hbs/';

    return {
        categoryEndPointPath: categoryEndPointPath,
        endPointHost: endPointHost,
        handlebarTemplatesDir: handlebarTemplatesDir,
        productListingEndPointPath: productListingEndPointPath,
        searchResultsEndPointPath: searchResultsEndPointPath,
        mfaEndPointPath: mfaEndPointPath,
        pointsTransferDetailEndPointPath: pointsTransferDetailEndPointPath
    };
})();
