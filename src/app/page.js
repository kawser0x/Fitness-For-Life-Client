import Hero from "@/components/home/Hero";
import FeaturedClasses from "@/components/home/FeaturedClasses";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LatestForumPosts from "@/components/home/LatestForumPosts";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedClasses />
      <WhyChooseUs />
      <LatestForumPosts />
      <Testimonials />
    </main>
  );
}
