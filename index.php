<?php
$current_page = 'home';
$page_title = 'Premium Marquee Hire in Limerick, Ireland';
$page_description = 'Vertex Marquees provides premium marquee and event hire in Limerick and across Ireland. Pagoda marquees for parties, weddings, and corporate events. Get a free quote today.';
include 'includes/header.php';
?>

    <!-- Hero Section -->
    <section class="hero" style="background-image: url('images/hero/hero-home.jpg');">
        <div class="hero-content">
            <img src="images/logo/vertex-logo-white.png" alt="<?php echo $business_name; ?>" class="hero-logo">
            <p class="hero-tagline">Premium Marquee Hire for Every Occasion</p>
            <a href="contact.php#quote-form" class="btn btn-vertex">Get a Quote</a>
        </div>
    </section>

    <!-- Introduction Section -->
    <section class="section section--dark">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0 fade-in">
                    <h2>Welcome to <?php echo $business_name; ?></h2>
                    <div class="art-deco-divider" style="margin-left: 0;"></div>
                    <p>Based in Limerick, Vertex Marquees provides premium marquee hire for every occasion. Whether you're planning a party, wedding, corporate event, or celebration, we have the perfect setup for you.</p>
                    <p>Our pagoda marquees come complete with hardwood flooring, lighting, and a range of wall options to suit your event. We handle delivery, setup, and collection so you can focus on enjoying your event.</p>
                    <a href="services.php" class="btn btn-vertex mt-3">View Our Services</a>
                </div>
                <div class="col-lg-6 fade-in">
                    <img src="images/hero/hero-home.jpg" alt="Vertex Marquees pagoda setup" class="img-fluid rounded" style="border: 1px solid var(--color-mid-grey);">
                </div>
            </div>
        </div>
    </section>

    <!-- Services Preview -->
    <section class="section section--darker">
        <div class="container">
            <div class="section-title fade-in">
                <h2>Our Services</h2>
                <p class="subtitle">What We Offer</p>
            </div>
            <div class="row g-4">
                <!-- Party Packages -->
                <div class="col-md-4 fade-in">
                    <div class="service-card text-center">
                        <i class="bi bi-balloon-heart" style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 1rem; display: block;"></i>
                        <h3>Party Packages</h3>
                        <p>A simple, stress-free marquee setup perfect for parties, giving you a covered space to eat, drink, and celebrate.</p>
                        <a href="services.php" class="btn btn-vertex btn-sm mt-2">Learn More</a>
                    </div>
                </div>
                <!-- Event Packages -->
                <div class="col-md-4 fade-in">
                    <div class="service-card text-center">
                        <i class="bi bi-stars" style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 1rem; display: block;"></i>
                        <h3>Event Packages</h3>
                        <p>A clean, stylish marquee option for events, offering shelter, light, and a comfortable space for guests to gather.</p>
                        <a href="services.php" class="btn btn-vertex btn-sm mt-2">Learn More</a>
                    </div>
                </div>
                <!-- Bespoke -->
                <div class="col-md-4 fade-in">
                    <div class="service-card text-center">
                        <i class="bi bi-gem" style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 1rem; display: block;"></i>
                        <h3>Bespoke Solutions</h3>
                        <p>Need something unique? Contact us to discuss a custom marquee setup tailored to your specific event needs.</p>
                        <a href="contact.php#quote-form" class="btn btn-vertex btn-sm mt-2">Get a Quote</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Gallery Preview -->
    <section class="section section--dark">
        <div class="container">
            <div class="section-title fade-in">
                <h2>Our Work</h2>
                <p class="subtitle">See Our Marquees in Action</p>
            </div>
            <div class="row g-3 fade-in">
                <div class="col-6 col-md-3">
                    <div class="gallery-item">
                        <img src="images/gallery/thumbs/gallery-01.jpg" alt="Marquee setup for outdoor event" loading="lazy">
                        <div class="overlay"><span>View</span></div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="gallery-item">
                        <img src="images/gallery/thumbs/gallery-02.jpg" alt="Pagoda marquee with lighting" loading="lazy">
                        <div class="overlay"><span>View</span></div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="gallery-item">
                        <img src="images/gallery/thumbs/gallery-03.jpg" alt="Double marquee party setup" loading="lazy">
                        <div class="overlay"><span>View</span></div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="gallery-item">
                        <img src="images/gallery/thumbs/gallery-04.jpg" alt="Event marquee with panoramic walls" loading="lazy">
                        <div class="overlay"><span>View</span></div>
                    </div>
                </div>
            </div>
            <div class="text-center mt-4 fade-in">
                <a href="gallery.php" class="btn btn-vertex">View Full Gallery</a>
            </div>
        </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-banner">
        <div class="container fade-in">
            <h2>Ready to Make Your Event Unforgettable?</h2>
            <p class="subtitle mb-4">Get in touch today for a free, no-obligation quote</p>
            <a href="contact.php#quote-form" class="btn btn-vertex-solid">Get a Quote</a>
        </div>
    </section>

<?php include 'includes/footer.php'; ?>
