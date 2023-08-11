export default function ({ store, redirect, route }) {
  if (!store.getters.hasToken) {
    return redirect('/login')
  }
}