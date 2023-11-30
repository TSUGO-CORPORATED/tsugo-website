// MODULES IMPORT
import { Metadata } from 'next';
import UpdateAppointmentCard from './update-appointment-card';

// PAGE NAME
export const metadata: Metadata = {
    title: 'Update Apppointment',
}

// PAGE COMPONENT
export default function UpdateAppointment(): JSX.Element {
    return (
        <div className="update-appointment">
          <UpdateAppointmentCard />
        </div>
    )
}