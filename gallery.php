<?php
$current_page = 'gallery';
$page_title = 'Gallery';
$page_description = 'Browse our gallery of marquee setups for parties, weddings, and events across Limerick and Ireland. See Vertex Marquees pagoda marquees in action.';
include 'includes/header.php';

// Gallery images array - add more as Luke provides them
$gallery_images = [
    ['thumb' => 'images/gallery/thumbs/gallery-01.jpg', 'full' => 'images/gallery/full/gallery-01.jpg', 'alt' => 'Pagoda marquee setup for outdoor party'],
    ['thumb' => 'images/gallery/thumbs/gallery-02.jpg', 'full' => 'images/gallery/full/gallery-02.jpg', 'alt' => 'Marquee interior with hardwood flooring and lighting'],
    ['thumb' => 'images/gallery/thumbs/gallery-03.jpg', 'full' => 'images/gallery/full/gallery-03.jpg', 'alt' => 'Double pagoda marquee for large event'],
    ['thumb' => 'images/gallery/thumbs/gallery-04.jpg', 'full' => 'images/gallery/full/gallery-04.jpg', 'alt' => 'Event marquee with panoramic window walls'],
    ['thumb' => 'images/gallery/thumbs/gallery-05.jpg', 'full' => 'images/gallery/full/gallery-05.jpg', 'alt' => 'Marquee setup at sunset'],
    ['thumb' => 'images/gallery/thumbs/gallery-06.jpg', 'full' => 'images/gallery/full/gallery-06.jpg', 'alt' => 'Party marquee with festive decorations'],
    ['thumb' => 'images/gallery/thumbs/gallery-07.jpg', 'full' => 'images/gallery/full/gallery-07.jpg', 'alt' => 'Corporate event marquee setup'],
    ['thumb' => 'images/gallery/thumbs/gallery-08.jpg', 'full' => 'images/gallery/full/gallery-08.jpg', 'alt' => 'Marquee with evening lighting'],
];
?>

    <!-- Page Hero -->
    <section class="page-hero" style="background-image: url('images/hero/hero-gallery.jpg');">
        <div class="page-hero-content">
            <h1>Our Gallery</h1>
            <p class="subtitle">See Our Marquees in Action</p>
        </div>
    </section>

    <!-- Gallery Grid -->
    <section class="section section--dark">
        <div class="container">
            <div class="gallery-grid fade-in">
                <?php foreach ($gallery_images as $index => $image): ?>
                    <div class="gallery-item" data-index="<?php echo $index; ?>" data-full="<?php echo $image['full']; ?>">
                        <img src="<?php echo $image['thumb']; ?>"
                             alt="<?php echo $image['alt']; ?>"
                             loading="lazy"
                             width="400" height="300">
                        <div class="overlay"><span>View</span></div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Lightbox -->
    <div class="lightbox-overlay" id="lightbox">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
        <img id="lightbox-img" src="" alt="">
        <div class="lightbox-counter" id="lightbox-counter"></div>
    </div>

    <!-- CTA Banner -->
    <section class="cta-banner">
        <div class="container fade-in">
            <h2>Like What You See?</h2>
            <p class="subtitle mb-4">Get in touch today for a free, no-obligation quote</p>
            <a href="contact.php#quote-form" class="btn btn-vertex-solid">Get a Quote</a>
        </div>
    </section>

    <!-- Lightbox JS -->
    <script src="js/lightbox.js"></script>

<?php include 'includes/footer.php'; ?>
