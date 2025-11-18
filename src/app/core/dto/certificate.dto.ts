// DTO para certificado
export interface CertificateDto {
    id: number;
    event_id: number;
    user_id: number;
    certificate_path: string;
    generated_at: string; // ISO format
    sent_by_email: boolean;
    event: {
        title: string;
        date: string; // ISO format
        location: string;
        speaker: string;
        institution_organizer: string;
    };
}
