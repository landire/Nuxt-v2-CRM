export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('BagReportUser')) {
    return redirect(`/`)
  }
}