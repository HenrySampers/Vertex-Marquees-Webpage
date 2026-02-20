    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <!-- Column 1: Logo & Tagline -->
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <img src="images/logo/vertex-logo-white.png" alt="<?php echo $business_name; ?>" style="height: 60px; margin-bottom: 1rem;">
                    <p><?php echo $business_tagline; ?></p>
                    <p class="small">Premium marquee hire for parties, weddings, corporate events, and celebrations across Ireland.</p>
                </div>

                <!-- Column 2: Quick Links -->
                <div class="col-lg-4 mb-4 mb-lg-0">
                    <h5>Quick Links</h5>
                    <ul class="footer-links">
                        <li><a href="index.php">Home</a></li>
                        <li><a href="services.php">Services</a></li>
                        <li><a href="gallery.php">Gallery</a></li>
                        <li><a href="contact.php">Contact Us</a></li>
                        <li><a href="contact.php#quote-form">Get a Quote</a></li>
                    </ul>
                </div>

                <!-- Column 3: Contact & Social -->
                <div class="col-lg-4">
                    <h5>Get in Touch</h5>
                    <p>
                        <i class="bi bi-telephone me-2"></i>
                        <a href="tel:<?php echo $business_phone_link; ?>"><?php echo $business_phone; ?></a>
                    </p>
                    <p>
                        <i class="bi bi-envelope me-2"></i>
                        <a href="mailto:<?php echo $business_email; ?>"><?php echo $business_email; ?></a>
                    </p>
                    <p>
                        <i class="bi bi-geo-alt me-2"></i>
                        <?php echo $business_location; ?>
                    </p>

                    <!-- Social Links -->
                    <div class="footer-social mt-3">
                        <?php if ($social_links['facebook'] !== '#'): ?>
                            <a href="<?php echo $social_links['facebook']; ?>" target="_blank" rel="noopener" aria-label="Facebook">
                                <i class="bi bi-facebook"></i>
                            </a>
                        <?php endif; ?>
                        <?php if ($social_links['instagram'] !== '#'): ?>
                            <a href="<?php echo $social_links['instagram']; ?>" target="_blank" rel="noopener" aria-label="Instagram">
                                <i class="bi bi-instagram"></i>
                            </a>
                        <?php endif; ?>
                        <?php if ($social_links['tiktok'] !== '#'): ?>
                            <a href="<?php echo $social_links['tiktok']; ?>" target="_blank" rel="noopener" aria-label="TikTok">
                                <i class="bi bi-tiktok"></i>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Bottom Bar -->
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> <?php echo $business_name; ?>. All rights reserved.</p>
                <p class="small">We collect your data only to respond to your enquiry. We do not share your information with third parties.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Navbar scroll effect -->
    <script>
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar-custom');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Scroll animation (fade-in elements)
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    </script>
</body>
</html>
