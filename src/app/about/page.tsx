import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AnimatedSection from "@/components/AnimatedSection";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-serif mb-6">About</h1>
            <p className="text-lg text-muted-foreground">
              Passionate about sharing thoughts and information on everything
              that makes my days better.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="relative h-[500px]">
              <Image
                src="https://ext.same-assets.com/1073646692/524880185.jpeg"
                alt="Dena portrait"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-serif mb-6">Hi, I'm Dena</h2>
              <div className="space-y-4">
                <p>
                  A mental health blogger. Passionate about sharing thoughts and
                  information on everything that makes my days better.
                </p>
                <p>
                  I'm a paragraph. Click here to add your own text and edit me.
                  Its easy. Just click "Edit Text" or double click me to add
                  your own content and make changes to the font. Feel free to
                  drag and drop me anywhere you like on your page. I'm a great
                  place for you to tell a story and let your users know a little
                  more about you.
                </p>
                <p>
                  This is a great space to write a long text about your company
                  and your services. You can use this space to go into a little
                  more detail about your company. Talk about your team and what
                  services you provide. Tell your visitors the story of how you
                  came up with the idea for your business and what makes you
                  different from your competitors. Make your company stand out
                  and show your visitors who you are.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="bg-stone-100 py-16 px-8 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-serif mb-6">My Philosophy</h2>
              <p className="text-lg mb-4">
                I believe that mental health is just as important as physical
                health, and that taking care of your mind should be a daily
                practice.
              </p>
              <p>
                Through my blog, I aim to share practical tips, personal
                experiences, and researched information that can help others on
                their journey to better mental health. I'm not a therapist or a
                medical professional – just someone who has learned a lot
                through personal experience and wants to share that knowledge
                with others.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-serif mb-10 text-center">
              What Inspires Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative h-[250px] w-full mb-4 overflow-hidden group">
                  <Image
                    src="https://ext.same-assets.com/3491983035/3642152498.jpeg"
                    alt="Inspiration - Reading"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2">Reading</h3>
                <p className="text-sm text-muted-foreground">
                  Books that expand my mind and help me see the world
                  differently
                </p>
              </div>
              <div className="text-center">
                <div className="relative h-[250px] w-full mb-4 overflow-hidden group">
                  <Image
                    src="https://ext.same-assets.com/1477868214/72342014.jpeg"
                    alt="Inspiration - Nature"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2">Nature</h3>
                <p className="text-sm text-muted-foreground">
                  Walking outdoors and connecting with the natural world
                </p>
              </div>
              <div className="text-center">
                <div className="relative h-[250px] w-full mb-4 overflow-hidden group">
                  <Image
                    src="https://ext.same-assets.com/1696795342/3498023296.jpeg"
                    alt="Inspiration - Quiet moments"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-serif mb-2">Quiet Moments</h3>
                <p className="text-sm text-muted-foreground">
                  Taking time for reflection and mindfulness every day
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif mb-6">Let's Connect</h2>
            <p className="mb-6">
              I'm always interested in connecting with readers and hearing your
              stories. Feel free to reach out through social media or the
              contact form.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com/wix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                Facebook
              </a>
              <a
                href="https://www.twitter.com/wix"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                Twitter
              </a>
              <a
                href="https://www.instagram.com/wix/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                Instagram
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
