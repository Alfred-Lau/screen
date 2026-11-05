export type ViewportType = 'mobile' | 'desktop';

export interface BasePageSearchParams {
  viewport: ViewportType;
}

export interface PageBaseProps<S = Record<string, any>, P = Record<string, any>> {
  searchParams: Promise<BasePageSearchParams & S>;
  params: Promise<P>;
}

export async function getPageBaseProps<S = object, P = object>(props: PageBaseProps<S, P>) {
  const { searchParams: propsSearchParams, params: propsParams } = props;
  const searchParams = await propsSearchParams;
  const params = await propsParams;

  return {
    searchParams,
    params,
  };
}

export interface LayoutProps<S = object, P = object> {
  children: React.ReactNode;
  searchParams: Promise<BasePageSearchParams & S>;
  params: Promise<P>;
}

export const isMobile = (viewport: ViewportType) => viewport === 'mobile';

export const isDesktop = (viewport: ViewportType) => viewport === 'desktop';

type GetViewportProps = Pick<PageBaseProps, 'searchParams'>;

export async function getViewport<T extends GetViewportProps>(props: T) {
  const searchParams = await props.searchParams;
  const { viewport } = searchParams;
  const isMobileScreen = viewport === 'mobile';

  return {
    isMobileScreen,
    isDesktopScreen: !isMobileScreen,
  };
}

export const getViewportWithSearchParams = (searchParams: BasePageSearchParams) => {
  const { viewport } = searchParams || {};
  const isMobileScreen = viewport === 'mobile';

  return {
    isMobileScreen,
    isDesktopScreen: !isMobileScreen,
  };
};
