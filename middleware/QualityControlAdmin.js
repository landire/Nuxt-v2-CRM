export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('QualityControlAdmin')) {
    return redirect(`/`)
  }
}