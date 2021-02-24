export default function ({store, redirect}) {
    if(store.getters.getToken == null)
        {
            return redirect('/admin')
        }
}