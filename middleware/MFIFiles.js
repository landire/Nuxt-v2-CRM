export default function ({ store, redirect, route }) {
  if (!store.state.permissionList.includes('MFIFilesAdmin') && !store.state.permissionList.includes('MFIFilesUser')) {
    return redirect(`/`)
  }
}