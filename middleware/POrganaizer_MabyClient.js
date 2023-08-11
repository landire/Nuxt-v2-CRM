export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('POrganaizer_MabyClient')) {
    return redirect(`/`)
  }
}