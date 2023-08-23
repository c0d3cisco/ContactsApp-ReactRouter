import {
	getContact,
	getContacts,
	createContact,
	updateContact,
	deleteContact,
} from "../contacts";
import { redirect } from "react-router-dom";

// * Components(?) loaders and actions
export async function rootLoader({ request }) {
	const url = new URL(request.url);
	const q = url.searchParams.get("q") || "";
	const contacts = await getContacts(q);
	return { contacts, q };
}

export async function rootAction() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export async function contactLoader({ params }) {
	const contact = await getContact(params.contactId);
	if (!contact) {
		throw new Response("", {
			status: 404,
			statusText: "Not Found",
		});
	}
	return { contact };
}

export async function contactAction({ request, params }) {
	let formData = await request.formData();
	return updateContact(params.contactId, {
		favorite: formData.get("favorite") === "true",
	});
}


// * Form actions
export async function editAction({ request, params }) { // - request comes from the form
	const formData = await request.formData(); // - formData is a FormData object. In this case, it matches contact format
	const updates = Object.fromEntries(formData);
	await updateContact(params.contactId, updates);
	return redirect(`/contacts/${params.contactId}`);
}
export async function destroyAction({ params }) {
	await deleteContact(params.contactId);
	return redirect("/");
}




