import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useState} from 'react'

export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

// export async function loader({context}) {
//   return await context.storefront.query(COLLECTIONS_QUERY);
// }
// export default function Index() {
//   const {collections} = useLoaderData();
//   return (
//     <section className="w-full gap-4">
//       <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
//         Collections
//       </h2>
//       <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3">
//         {collections.nodes.map((collection) => {
//           return (
//             <Link to={`/collections/${collection.handle}`} key={collection.id}>
//               <div className="grid gap-4">
//                 {collection?.image && (
//                   <Image
//                     alt={`Image of ${collection.title}`}
//                     data={collection.image}
//                     key={collection.id}
//                     sizes="(max-width: 32em) 100vw, 33vw"
//                     crop="center"
//                   />
//                 )}
//                 <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
//                   {collection.title}
//                 </h2>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// export async function loader({context}) {
//   const {storefront} = context;
//   const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
//   const featuredCollection = collections.nodes[0];
//   const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

//   return defer({featuredCollection, recommendedProducts});
// }

// export default function Homepage() {
//   const data = useLoaderData();
//   return (
//     <div className="home">
//       <FeaturedCollection collection={data.featuredCollection} />
//       <RecommendedProducts products={data.recommendedProducts} />
//     </div>
//   );
// }

// edited async function 
export async function loader({context}) {
  const {storefront} = context;
  // const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  // const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  // return defer({recommendedProducts});
  return await context.storefront.query(COLLECTIONS_QUERY);
}

export default function Homepage() {
  const data = useLoaderData();
  return (
    <div className="home">
      <FeaturedCollection  />
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}

// function FeaturedCollection({collection}) {
//   const image = collection.image;
//   return (
//     <Link
//       className="featured-collection"
//       to={`/collections/${collection.handle}`}
//     >
//       {image && (
//         <div className="featured-collection-image">
//           <Image data={image} sizes="100vw" />
//         </div>
//       )}
//       <h1>{collection.title}</h1>
//     </Link>
//   );
// }

  // edited featured collection
function FeaturedCollection() {
  const {collections} = useLoaderData();
  const [hoveredCollection, setHovertedCollection] = useState(null);
  // const image = collection.image;
  return (
    <div className='indexContainer'>
      {collections.nodes.map((collection) => {
        console.log('aaaa', collection.description)
        return (
          <Link to={`/collections/${collection.handle}`} 
          key={collection.id}
          onMouseEnter={() => setHovertedCollection(collection.id)}
          onMouseLeave={() => setHovertedItem(null)}>
            <div className={`border-2 mb-12 ${hoveredCollection === collection.id ? 'hovered' : ''}`}>
              {collection?.image && (
                <Image
                alt={`Image of ${collection.title}`}
                data={collection.image}
                key={collection.id}
                sizes="(max-width: 32em) 80vw, 33vw"
                crop="center"
                />
              )}
              {/* <h1>{collection.title}</h1>
              <p>{collection.description}</p> */}
            </div>
          </Link>
        )
      })}
    </div>
  );
}


function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
        description
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
