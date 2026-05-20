import { ShieldCheck } from 'lucide-react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center gap-6 border-b border-slate-100 pb-8">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">MamaCare: Terms of Service & Privacy Consent</h1>
                        <p className="text-slate-500 mt-1">Effective Date: March 29, 2026 | Version: 2.0 (Clinical Compliance)</p>
                    </div>
                </div>
                
                <div className="prose prose-slate max-w-none text-slate-600 space-y-8 text-[15px] leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">1. Introduction and Acceptance of Terms</h2>
                        <p>These Terms of Service and Privacy Consent (“Terms”) govern your access to and use of the MamaCare application, an AI-assisted maternal health support platform.</p>
                        <p>By accessing, registering, or using MamaCare, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must discontinue use of the application immediately.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">2. Nature and Scope of Services (Medical Disclaimer)</h2>
                        <p>MamaCare is an AI-assisted maternal decision-support system designed to provide informational insights based on user-provided data.</p>
                        
                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">2.1 No Medical Advice</h3>
                        <p>MamaCare does not provide medical advice, diagnosis, or treatment. All outputs, including but not limited to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Risk classifications (Low, Medium, High)</li>
                            <li>AI-generated responses (“MamaAI”)</li>
                            <li>Health tips and recommendations</li>
                        </ul>
                        <p className="mt-2">are intended strictly for informational and educational purposes.</p>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">2.2 Not a Substitute for Professional Care</h3>
                        <p>Use of MamaCare does not establish a doctor–patient relationship. The platform is not a replacement for consultation with qualified healthcare professionals.</p>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">2.3 Emergency Situations</h3>
                        <p>In the event of medical emergencies, including but not limited to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Severe abdominal pain</li>
                            <li>Vaginal bleeding</li>
                            <li>Reduced or absent fetal movement</li>
                        </ul>
                        <p className="mt-2 text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-100">You must immediately seek care from the nearest licensed healthcare facility. MamaCare must not be relied upon in emergency situations.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">3. Eligibility</h2>
                        <p>You must be at least 18 years of age or have consent from a legal guardian to use this application. By using MamaCare, you confirm that the information you provide is accurate and that you meet the eligibility requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">4. Data Collection and Clinical Necessity</h2>
                        <p>MamaCare processes personal and sensitive health data strictly for clinical support and system functionality.</p>
                        
                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">4.1 Types of Data Collected</h3>
                        <p>This may include, but is not limited to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Personal identifiers (e.g., name, phone number)</li>
                            <li>Obstetric data (LMP, gravida, parity)</li>
                            <li>Medical history (e.g., hypertension, diabetes)</li>
                            <li>Vital measurements (e.g., blood pressure, glucose levels)</li>
                            <li>Pregnancy progression data</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">4.2 Purpose of Processing</h3>
                        <p>Your data is processed to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Generate pregnancy timelines and developmental insights</li>
                            <li>Perform AI-driven maternal risk stratification</li>
                            <li>Produce clinical summaries and referral reports</li>
                            <li>Enable continuity of care with healthcare providers</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">4.3 Legal Basis for Processing</h3>
                        <p>Processing is conducted based on:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Your explicit consent</li>
                            <li>Clinical necessity for maternal health support</li>
                            <li>Legitimate interest in improving maternal healthcare outcomes</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">5. Data Privacy, Security, and Confidentiality</h2>
                        <p>MamaCare implements industry-grade safeguards to protect your data.</p>
                        
                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">5.1 Data Encryption</h3>
                        <p>All sensitive data is encrypted:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>In transit using secure communication protocols</li>
                            <li>At rest using strong encryption standards</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">5.2 Access Control</h3>
                        <p>Access to identifiable health data is restricted to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Authorized system processes</li>
                            <li>Verified healthcare professionals, and only when you provide your unique MamaCare ID</li>
                        </ul>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">5.3 Data Minimization</h3>
                        <p>Only data necessary for clinical functionality and system performance is collected and processed.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">6. Data Sharing and Anonymization</h2>
                        
                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">6.1 Controlled Sharing</h3>
                        <p>Your identifiable data will not be shared with third parties without your consent, except where required by law or for medical referral purposes.</p>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">6.2 Anonymized Data Use</h3>
                        <p>De-identified and aggregated data may be used for:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Improving AI model performance</li>
                            <li>Public health research</li>
                            <li>System optimization</li>
                        </ul>
                        <p className="mt-2 text-sm text-slate-500">Such data cannot be used to identify you personally.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">7. User Responsibilities</h2>
                        <p>As a user of MamaCare, you agree to:</p>
                        
                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">7.1 Provide Accurate Information</h3>
                        <p>Ensure all medical and personal data entered into the system is truthful and up to date.</p>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">7.2 Maintain Security</h3>
                        <p>Keep your login credentials confidential and secure. You are responsible for all activity under your account.</p>

                        <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">7.3 Appropriate Use</h3>
                        <p>Use the application in a lawful and responsible manner. Misuse, including falsification of medical data, may result in suspension of access.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">8. Consent to AI Processing and Automation</h2>
                        <p>By selecting <span className="font-bold">“I Consent & Continue,”</span> you explicitly authorize MamaCare to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Process your health data using AI algorithms for risk assessment</li>
                            <li>Analyze trends in your medical data for predictive insights</li>
                            <li>Store and organize your obstetric and clinical history</li>
                            <li>Generate downloadable reports for healthcare providers</li>
                            <li>Provide automated, context-aware health guidance</li>
                        </ul>
                        <p className="mt-4 font-semibold text-slate-800">You acknowledge that AI-generated outputs may not always be accurate and should be interpreted alongside professional medical advice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">9. Data Retention</h2>
                        <p>Your data will be retained only for as long as necessary to:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Provide services</li>
                            <li>Comply with legal and regulatory obligations</li>
                            <li>Support clinical continuity</li>
                        </ul>
                        <p className="mt-2">You may request deletion of your data, subject to applicable legal requirements.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">10. Limitation of Liability</h2>
                        <p>To the fullest extent permitted by law, MamaCare and its developers shall not be liable for:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Any medical decisions made based on application outputs</li>
                            <li>Misinterpretation of AI-generated insights</li>
                            <li>Delays or failures in seeking professional care</li>
                        </ul>
                        <p className="mt-2 font-semibold">Use of the application is at your own risk.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">11. Regulatory Compliance</h2>
                        <p>MamaCare is designed with consideration for:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Health data protection principles</li>
                            <li>Clinical safety standards</li>
                            <li>Ethical AI use in healthcare</li>
                        </ul>
                        <p className="mt-2">Where applicable, the platform aligns with regional and international data protection frameworks.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">12. Updates to Terms</h2>
                        <p>MamaCare reserves the right to update these Terms at any time. Continued use of the application following updates constitutes acceptance of the revised Terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2">13. Contact Information</h2>
                        <p>For inquiries, support, or data-related requests, contact:</p>
                        <div className="bg-slate-100 p-4 rounded-xl mt-4 inline-block">
                            <p className="font-semibold text-slate-800">MamaCare Support Team</p>
                            <p className="mt-1">Email: <a href="mailto:support@mamacare.health" className="text-indigo-600 hover:underline">support@mamacare.health</a></p>
                            <p>Phone: +254 XXX XXX XXX</p>
                        </div>
                    </section>

                    <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mt-8">
                        <h2 className="text-xl font-bold text-emerald-900 mb-3">14. Acknowledgment and Consent</h2>
                        <p className="text-emerald-800">By clicking <span className="font-bold">“I Consent & Continue”</span>, you confirm that:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-emerald-800">
                            <li>You have read and understood these Terms</li>
                            <li>You consent to the collection and processing of your health data</li>
                            <li>You acknowledge the limitations of AI-based medical support</li>
                            <li>You agree to use MamaCare responsibly</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
