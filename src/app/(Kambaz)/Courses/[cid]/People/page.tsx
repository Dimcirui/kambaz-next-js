// Use redirect since the assignment wants /People to go to /People/Table,
// but dynamic styling visits the /People link in the navigation bar.
import { redirect } from 'next/navigation';

export default function PeoplePage({ params }: { params: { cid: string } }) {
  redirect(`/Courses/${params.cid}/People/Table`);
}