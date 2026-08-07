import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Autovaly",
  description: "Get in touch with the Autovaly editorial team.",
  openGraph: {
    title: "Contact Us | Autovaly",
    description: "Get in touch with the Autovaly editorial team.",
    url: "https://autovaly.com/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-3xl min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-4">
        Contact Us
      </h1>
      <p className="text-xl text-muted mb-12">
        Have a tip, feedback, or business inquiry? We'd love to hear from you.
      </p>

      <ContactForm />
    </div>
  );
}
