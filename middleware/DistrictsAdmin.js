export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('DistrictsAdmin')) {
    return redirect(`/`)
  }
}