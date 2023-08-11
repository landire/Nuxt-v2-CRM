export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('TarifAdmin')) {
    return redirect(`/`)
  }
}