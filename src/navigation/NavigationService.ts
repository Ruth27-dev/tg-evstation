import {
  CommonActions,
  createNavigationContainerRef,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';

export const navigationRef: any = createNavigationContainerRef();


export function navigate(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name,
        params,
      }),
    );
  }
}

export function push(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function reset(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name, params}],
      }),
    );
  }
}

export function replace(name: string, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

export function replaceTarget(name: string, route: any, params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch({
      ...StackActions.replace(name, params),
      source: route.key,
      target: navigationRef.getState().key,
    });
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    if (navigationRef.canGoBack())
      navigationRef.dispatch(CommonActions.goBack());
  }
}

export function openDrawer() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(DrawerActions.openDrawer())
    }
}
export function closeDrawer() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(DrawerActions.closeDrawer())
    }
}

export function toggleDrawer(name: string, params: any = {}) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(DrawerActions.toggleDrawer())
    }
}

