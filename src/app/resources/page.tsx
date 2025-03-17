import Link from "next/link";
import Image from "next/image";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";
import ContactLink from "@/components/ContactLink";

const resources = [
  {
    title: "Books That Changed My Perspective",
    description:
      "A collection of books that have helped me understand mental health better.",
    image: "https://ext.same-assets.com/3491983035/3642152498.jpeg",
    items: [
      { name: "The Body Keeps the Score", author: "Bessel van der Kolk" },
      { name: "Atomic Habits", author: "James Clear" },
      { name: "Lost Connections", author: "Johann Hari" },
      { name: "The Highly Sensitive Person", author: "Elaine N. Aron" },
      { name: "Maybe You Should Talk to Someone", author: "Lori Gottlieb" },
    ],
  },
  {
    title: "Podcasts I Love",
    description:
      "Thoughtful conversations that explore mental health from different angles.",
    image: "https://ext.same-assets.com/936487332/580407348.jpeg",
    items: [
      { name: "The Happiness Lab", author: "Dr. Laurie Santos" },
      { name: "Ten Percent Happier", author: "Dan Harris" },
      { name: "Unlocking Us", author: "Brené Brown" },
      { name: "Therapy for Black Girls", author: "Dr. Joy Harden Bradford" },
      { name: "The Mental Illness Happy Hour", author: "Paul Gilmartin" },
    ],
  },
  {
    title: "Helpful Apps",
    description: "Digital tools that can support your mental wellness journey.",
    image: "https://ext.same-assets.com/3899887341/3615040631.jpeg",
    items: [
      { name: "Headspace", author: "Meditation and mindfulness" },
      { name: "Calm", author: "Sleep, meditation and relaxation" },
      { name: "Jour", author: "Guided journaling" },
      { name: "Woebot", author: "AI cognitive behavioral therapy" },
      { name: "Daylio", author: "Mood tracking" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-serif mb-6">Resources</h1>
            <p className="text-lg text-muted-foreground">
              A collection of tools, books, and services that have helped me on
              my mental health journey. I hope they can be useful for you too.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
          {resources.map((resource, index) => (
            <AnimatedSection key={index} delay={0.2 * (index + 1)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="relative h-[300px] w-full md:col-span-1 overflow-hidden group">
                  <Image
                    src={resource.image}
                    alt={resource.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-serif mb-3">{resource.title}</h2>
                  <p className="text-muted-foreground mb-6">
                    {resource.description}
                  </p>
                  <ul className="space-y-3">
                    {resource.items.map((item, idx) => (
                      <li key={idx} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground text-sm">
                            {item.author}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.8}>
          <div className="bg-stone-100 p-10 rounded-lg max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-serif mb-4 text-center">Disclaimer</h2>
            <p className="text-center mb-4">
              The resources shared on this page are based on personal
              experiences and preferences. I am not a mental health
              professional, and these recommendations should not be considered
              medical advice.
            </p>
            <p className="text-center">
              If you're struggling with mental health issues, please consult
              with a qualified healthcare provider or contact a mental health
              helpline in your area.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={1}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif mb-4">
              Have a Resource to Share?
            </h2>
            <p className="mb-6">
              If you've found something helpful that you think others would
              benefit from, I'd love to hear about it. Please reach out through
              the contact form.
            </p>
            <ContactLink className="border border-gray-300 px-6 py-3 text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors inline-block">
              Contact Me
            </ContactLink>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
