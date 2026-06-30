import { Info } from 'lucide-react';

const EducationalTip = () => {
    return (
        <div className="bg-indigo-50 rounded-2xl p-5 md:p-6 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center md:items-start gap-4 transition-all duration-300 hover:shadow-md">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0 mt-1 sm:mt-0 md:mt-1">
                <Info size={24} />
            </div>
            <div>
                <h4 className="text-lg font-bold text-indigo-900 mb-2">Why IFAS Matters</h4>
                <p className="text-indigo-800/80 leading-relaxed text-sm md:text-base">
                    Iron helps your body make extra blood for you and your baby, preventing maternal anemia and reducing fatigue. Folic acid is essential in the early stages of pregnancy to protect your baby against severe spinal cord and brain defects.
                </p>
            </div>
        </div>
    );
};

export default EducationalTip;
