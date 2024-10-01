import { useEffect } from 'react';
import MetaTag from '../../../services/api/general-apis/meta-tag-api';
import { CONSTANTS } from '../../../services/config/app-config';
import useGoogleAnalyticsOperationsHandler from '../../../hooks/GoogleAnalytics/useGoogleAnalyticsOperationsHandler';
import ProductListingMaster from '../../../components/ProductCategoriesComponents/ProductListingMaster';
import PageMetaData from '../../../components/PageMetaData';
import { MetaDataTypes } from '../../../interfaces/meta-data-interface';

const Index = ({ metaData }: MetaDataTypes) => {
  const { sendPageViewToGA } = useGoogleAnalyticsOperationsHandler();
  useEffect(() => {
    sendPageViewToGA(window.location.pathname + window.location.search, 'Product Listing Page');
  }, []);
  return (
    <>
      {CONSTANTS.ENABLE_META_TAGS && <PageMetaData meta_data={metaData} />}
      <>
        <ProductListingMaster />
      </>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const { SUMMIT_APP_CONFIG } = CONSTANTS;
  const method = 'get_meta_tags';
  const version = SUMMIT_APP_CONFIG.version;
  const entity = 'seo';
  const params = `?version=${version}&method=${method}&entity=${entity}`;
  const url = `${context.resolvedUrl.split('?')[0]}`;
  if (CONSTANTS.ENABLE_META_TAGS) {
    let metaDataFromAPI: any = await MetaTag(`${CONSTANTS.API_BASE_URL}${SUMMIT_APP_CONFIG.app_name}${params}&page_name=${url}`);
    if (
      metaDataFromAPI.status === 200 &&
      metaDataFromAPI?.data?.message?.msg === 'success' &&
      metaDataFromAPI?.data?.message?.data !== 'null'
    ) {
      const metaData = metaDataFromAPI?.data?.message?.data;
      return { props: { metaData } };
    }
  } else {
    return {
      props: {},
    };
  }
}
export default Index;
