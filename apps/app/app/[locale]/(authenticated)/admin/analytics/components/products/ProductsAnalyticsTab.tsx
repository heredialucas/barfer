import { getProductSales, getProductTimeline } from '@repo/data-services/src/services/barfer';
import { ProductsAnalyticsClient } from './ProductsAnalyticsClient';

interface ProductsAnalyticsTabProps {
    dateFilter: {
        from: Date;
        to: Date;
    };
    compareFilter?: {
        from: Date;
        to: Date;
    };
}

export async function ProductsAnalyticsTab({ dateFilter, compareFilter }: ProductsAnalyticsTabProps) {
    try {
        const [
            allProducts,
            pendingProducts,
            confirmedProducts,
        ] = await Promise.all([
            getProductSales('all', 20, dateFilter.from, dateFilter.to),
            getProductSales('pending', 20, dateFilter.from, dateFilter.to),
            getProductSales('confirmed', 20, dateFilter.from, dateFilter.to),
        ]);

        const productIds = Array.from(new Set(allProducts.map(p => p.productId)));

        const timelineData = await getProductTimeline(dateFilter.from, dateFilter.to, productIds);

        let compareAllProducts, comparePendingProducts, compareConfirmedProducts, compareTimelineData;
        if (compareFilter) {
            [
                compareAllProducts,
                comparePendingProducts,
                compareConfirmedProducts,
            ] = await Promise.all([
                getProductSales('all', 20, compareFilter.from, compareFilter.to),
                getProductSales('pending', 20, compareFilter.from, compareFilter.to),
                getProductSales('confirmed', 20, compareFilter.from, compareFilter.to),
            ]);
            const compareProductIds = Array.from(new Set(compareAllProducts.map(p => p.productId)));
            compareTimelineData = await getProductTimeline(compareFilter.from, compareFilter.to, compareProductIds);
        }

        return (
            <ProductsAnalyticsClient
                allProducts={allProducts}
                pendingProducts={pendingProducts}
                confirmedProducts={confirmedProducts}
                compareAllProducts={compareAllProducts}
                comparePendingProducts={comparePendingProducts}
                compareConfirmedProducts={compareConfirmedProducts}
                timelineData={timelineData}
                compareTimelineData={compareTimelineData}
                isComparing={!!compareFilter}
                dateFilter={dateFilter}
                compareFilter={compareFilter}
            />
        );
    } catch (error) {
        console.error('Error loading products analytics:', error);
        return (
            <div className="p-4 border rounded-lg">
                <p className="text-sm text-red-600">Error al cargar datos de productos</p>
            </div>
        );
    }
} 