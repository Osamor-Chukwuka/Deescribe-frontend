export default function StatisticsSection() {
    return (
        <div>
            <section className="bg-gray-50 my-[10%]">
                <div className="py-15">
                    <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-12">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold text-gray-900">2M+</h3>
                            <p className="text-gray-600">Active Writers</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-4xl font-bold text-gray-900">50M+</h3>
                            <p className="text-gray-600">Stories Published</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-4xl font-bold text-gray-900">100M+</h3>
                            <p className="text-gray-600">Monthly Readers</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}