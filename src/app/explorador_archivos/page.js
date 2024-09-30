import { ExploradorArchivos as EA } from "@/components/component/explorador_archivos";
import { MultiFileUploadModalComponent as Multi } from "@/components/component/multi-file-upload-modal"
function page() {
    return (
        <div style={{display:"flex"}}>
            <EA />
            <Multi />
        </div>
    );
}

export default page;