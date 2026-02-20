<?php
session_start();
$current_page = 'contact';
$page_title = 'Contact Us';
$page_description = 'Contact Vertex Marquees for a free quote on marquee hire in Limerick and across Ireland. Call, email, or fill in our online quote form.';
include 'includes/header.php';

// Check for form submission messages
$form_success = isset($_SESSION['form_success']) ? $_SESSION['form_success'] : '';
$form_error = isset($_SESSION['form_error']) ? $_SESSION['form_error'] : '';
$form_data = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : [];
unset($_SESSION['form_success'], $_SESSION['form_error'], $_SESSION['form_data']);
?>

    <!-- Page Hero -->
    <section class="page-hero" style="background-image: url('images/hero/hero-contact.jpg');">
        <div class="page-hero-content">
            <h1>Contact Us</h1>
            <p class="subtitle">We'd Love to Hear From You</p>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section section--dark">
        <div class="container">
            <div class="row g-5">

                <!-- Contact Details -->
                <div class="col-lg-5 fade-in">
                    <h2>Get in Touch</h2>
                    <div class="art-deco-divider" style="margin-left: 0;"></div>
                    <p class="mb-4">Whether you're planning a party, wedding, corporate event, or celebration, we're here to help. Reach out to us by phone, email, or use our quote form.</p>

                    <div class="contact-detail">
                        <i class="bi bi-telephone" style="font-size: 1.5rem; color: var(--color-accent);"></i>
                        <div>
                            <strong>Phone</strong><br>
                            <a href="tel:<?php echo $business_phone_link; ?>"><?php echo $business_phone; ?></a>
                        </div>
                    </div>

                    <div class="contact-detail">
                        <i class="bi bi-envelope" style="font-size: 1.5rem; color: var(--color-accent);"></i>
                        <div>
                            <strong>Email</strong><br>
                            <a href="mailto:<?php echo $business_email; ?>"><?php echo $business_email; ?></a>
                        </div>
                    </div>

                    <div class="contact-detail">
                        <i class="bi bi-geo-alt" style="font-size: 1.5rem; color: var(--color-accent);"></i>
                        <div>
                            <strong>Location</strong><br>
                            <?php echo $business_location; ?>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <h3 class="mt-4 mb-3">Follow Us</h3>
                    <div class="contact-social">
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

                <!-- Quote Form -->
                <div class="col-lg-7 fade-in" id="quote-form">
                    <div class="quote-form">
                        <h2 class="mb-1">Get a Quote</h2>
                        <p class="subtitle mb-4">Fill in the form below and we'll get back to you</p>

                        <?php if ($form_success): ?>
                            <div class="alert alert-success" role="alert">
                                <?php echo htmlspecialchars($form_success); ?>
                            </div>
                        <?php endif; ?>

                        <?php if ($form_error): ?>
                            <div class="alert alert-danger" role="alert">
                                <?php echo htmlspecialchars($form_error); ?>
                            </div>
                        <?php endif; ?>

                        <form action="process/send-quote.php" method="POST" id="quoteForm" novalidate>

                            <div class="mb-3">
                                <label for="name" class="form-label">Full Name *</label>
                                <input type="text" class="form-control" id="name" name="name" required
                                       placeholder="Your full name"
                                       value="<?php echo isset($form_data['name']) ? htmlspecialchars($form_data['name']) : ''; ?>">
                                <div class="invalid-feedback">Please enter your name.</div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label for="email" class="form-label">Email Address *</label>
                                    <input type="email" class="form-control" id="email" name="email" required
                                           placeholder="your@email.com"
                                           value="<?php echo isset($form_data['email']) ? htmlspecialchars($form_data['email']) : ''; ?>">
                                    <div class="invalid-feedback">Please enter a valid email address.</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="phone" class="form-label">Phone Number *</label>
                                    <input type="tel" class="form-control" id="phone" name="phone" required
                                           placeholder="083 XXX XXXX"
                                           value="<?php echo isset($form_data['phone']) ? htmlspecialchars($form_data['phone']) : ''; ?>">
                                    <div class="invalid-feedback">Please enter your phone number.</div>
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label for="county" class="form-label">County *</label>
                                    <select class="form-select" id="county" name="county" required>
                                        <option value="" disabled <?php echo empty($form_data['county']) ? 'selected' : ''; ?>>Select your county</option>
                                        <?php
                                        $counties = ['Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare','Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath','Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath','Wexford','Wicklow'];
                                        foreach ($counties as $county):
                                            $selected = (isset($form_data['county']) && $form_data['county'] === $county) ? 'selected' : '';
                                        ?>
                                            <option value="<?php echo $county; ?>" <?php echo $selected; ?>><?php echo $county; ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                    <div class="invalid-feedback">Please select your county.</div>
                                </div>
                                <div class="col-md-6">
                                    <label for="event_type" class="form-label">Event Type</label>
                                    <select class="form-select" id="event_type" name="event_type">
                                        <option value="" disabled <?php echo empty($form_data['event_type']) ? 'selected' : ''; ?>>Select event type</option>
                                        <option value="Party" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Party') ? 'selected' : ''; ?>>Party</option>
                                        <option value="Wedding" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Wedding') ? 'selected' : ''; ?>>Wedding</option>
                                        <option value="Corporate Event" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Corporate Event') ? 'selected' : ''; ?>>Corporate Event</option>
                                        <option value="Festival" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Festival') ? 'selected' : ''; ?>>Festival</option>
                                        <option value="Communion/Confirmation" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Communion/Confirmation') ? 'selected' : ''; ?>>Communion / Confirmation</option>
                                        <option value="Other" <?php echo (isset($form_data['event_type']) && $form_data['event_type'] === 'Other') ? 'selected' : ''; ?>>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="details" class="form-label">Event Details *</label>
                                <textarea class="form-control" id="details" name="details" rows="5" required
                                          placeholder="Tell us about your event - approximate date, number of guests, location, and any special requirements."><?php echo isset($form_data['details']) ? htmlspecialchars($form_data['details']) : ''; ?></textarea>
                                <div class="invalid-feedback">Please provide some details about your event.</div>
                            </div>

                            <div class="form-check mb-4">
                                <input class="form-check-input" type="checkbox" id="gdpr_consent" name="gdpr_consent" required>
                                <label class="form-check-label" for="gdpr_consent">
                                    I consent to Vertex Marquees collecting my data via this form to respond to my enquiry.
                                    My information will not be shared with third parties. *
                                </label>
                                <div class="invalid-feedback">You must consent to data collection to submit this form.</div>
                            </div>

                            <button type="submit" class="btn btn-vertex-solid w-100">
                                <i class="bi bi-send me-2"></i>Send Quote Request
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Bootstrap form validation -->
    <script>
        (function () {
            'use strict';
            var form = document.getElementById('quoteForm');
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        })();
    </script>

<?php include 'includes/footer.php'; ?>
