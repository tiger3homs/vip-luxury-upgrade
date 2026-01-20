import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: {
    amount: number;
    currency: string;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "VIP Luxury Cars - Your premium car dealer in Killwangen, Switzerland. Exclusive selection of high-end vehicles. Bahnhofstrasse 29, 8956 Killwangen.",
  image = "https://picsum.photos/id/1070/1200/630", // Default Fallback Image
  url,
  type = 'website',
  price
}) => {
  const siteTitle = "VIP Luxury Cars | Premium Auto Dealer";
  const fullTitle = title ? `${title} | VIP Luxury Cars` : siteTitle;
  const currentUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="VIP Luxury Cars" />

      {/* Product Specific OG */}
      {price && (
        <>
          <meta property="product:price:amount" content={price.amount.toString()} />
          <meta property="product:price:currency" content={price.currency} />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};