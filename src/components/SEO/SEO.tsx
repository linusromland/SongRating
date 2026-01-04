import { useEffect } from 'preact/hooks';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
}

export function SEO({
  title = 'Song Rating Arena | Music Competition Song Battle',
  description = 'Battle your favorite songs from music competitions using ELO rating system. Create personalized rankings and discover the best songs from various music contests.',
  keywords = 'song rating, ELO system, music competition, ranking, battle, vote, music contest',
  canonicalUrl = 'https://songrating.linusromland.com/',
  ogImage = 'https://songrating.linusromland.com/og-image.jpg',
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:url', canonicalUrl);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical URL
    updateCanonical(canonicalUrl);

    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, structuredData]);

  return null; // This component doesn't render anything
}

function updateMetaTag(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }
  if (!element) {
    element = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      element.setAttribute('property', property);
    } else {
      element.setAttribute('name', property);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function addStructuredData(data: any) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
