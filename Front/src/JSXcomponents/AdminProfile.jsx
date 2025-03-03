import { useAdmin } from "./Admin";

function AdminProfile(){
const {adminInfo} =useAdmin();
return(
    <>
    {adminInfo.first_name}; {adminInfo.last_name}
    </>
)

}


export default AdminProfile;