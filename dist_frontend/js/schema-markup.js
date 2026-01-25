/**
 * Schema Markup for SEO
 * JSON-LD structured data for better search rankings
 */

// Organization Schema (for homepage)
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Elitech Hub",
    "alternateName": "Elitech Hub Nigeria",
    "url": "https://elitechhub.com",
    "logo": "https://elitechhub.com/assets/images/logo.png",
    "description": "Premier cybersecurity education and training platform in Nigeria",
    "sameAs": [
        "https://twitter.com/elitechhub",
        "https://linkedin.com/company/elitechhub",
        "https://facebook.com/elitechhub"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+234-708-196-8062",
        "contactType": "customer service",
        "areaServed": "NG",
        "availableLanguage": "English"
    }
};

// Website Schema (for homepage)
export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Elitech Hub",
    "url": "https://elitechhub.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://elitechhub.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

// Generate Course Schema
export function generateCourseSchema(course) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description,
        "provider": {
            "@type": "Organization",
            "name": "Elitech Hub",
            "sameAs": "https://elitechhub.com"
        },
        "offers": {
            "@type": "Offer",
            "price": course.price_ngn,
            "priceCurrency": "NGN",
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online"
        }
    };
}

// Generate Article Schema (for blog posts)
export function generateArticleSchema(post) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.thumbnail,
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Elitech Hub",
            "logo": {
                "@type": "ImageObject",
                "url": "https://elitechhub.com/assets/images/logo.png"
            }
        },
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://elitechhub.com/blog/${post.slug}`
        }
    };
}

// Generate FAQ Schema
export function generateFAQSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// Generate Breadcrumb Schema
export function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

export default {
    organizationSchema,
    websiteSchema,
    generateCourseSchema,
    generateArticleSchema,
    generateFAQSchema,
    generateBreadcrumbSchema
};
