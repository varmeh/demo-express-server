// eslint-disable-next-line no-unused-vars
const deleteProduct = btn => {
	const prodId = btn.parentNode.querySelector('[name=id]').value
	const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value

	// eslint-disable-next-line no-undef
	fetch(`/admin/product/${prodId}`, {
		method: 'DELETE',
		headers: { 'csrf-token': csrfToken }
	})
		.then(result => result.json())
		.then(data => {
			console.log(data)
			btn.closest('article').remove()
		})
		.catch(err => console.log(err))
}
