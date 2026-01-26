
// toggle menu button
function toggleMenu(){
    console.log("toggleMenu() called");
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.nav');
    menu.classList.toggle('active');
    nav.classList.toggle('active');
}


// To change the bg videos by clicking on the gallery images..

const slideContent = {
    'service-1': {
        description:
            'We transform visions into experiences with our Mock-ups & Prototypes services. Our designers create detailed, interactive prototypes as blueprints for your projects. Each prototype guides development with clarity and precision.',
    },
    'service-2': {
        description:
            'Our developers craft cutting-edge web, hybrid, and native applications. We translate your needs into digital realities, ensuring each application fits your vision. Let us shape your digital future.',
    },
    'service-3': {
        description:
            'We offer comprehensive Network Security services to shield your enterprise from cyber threats. Our proactive approach ensures your business is safeguarded against digital intrusions. Trust us to protect your network and provide peace of mind.',
    },
    'service-4': {
        description:
            'We offer top-tier technical support and industry-standard customer service through interactive webinars. Join us for support that elevates your potential in the digital landscape.',
    },
    'service-5': {
        description:
            "We specialize in cutting-edge AI services that automate processes, provide predictive analytics, and enhance customer experiences. Partner with us to unlock AI's transformative potential for your business.",
    },
    'service-6': {
        description:
            'We offer cutting-edge AI services for smart automation, predictive analytics, and advanced data processing. Partner with us to transform your business with AI-driven strategies.',
    },
};

function changeVideo(name){
    const bgVideoList = document.querySelectorAll('.bg-video');
    const trailers = document.querySelectorAll('.trailer');
    const models = document.querySelectorAll('.model');
    const contentParagraph = document.querySelector('.content p');


//JavaScript higher order array function forEach
// makes easier to mapp data
    bgVideoList.forEach(video =>{
        video.classList.remove('active');
        if(video.classList.contains(name)){
            video.classList.add('active')
        }
    });

//Changing model names 

models.forEach(model =>{
    model.classList.remove('active');
    if(model.classList.contains(name)){
        model.classList.add('active')
    }
});

//Changing trailers per model

trailers.forEach(trailer =>{
    trailer.classList.remove('active');
    if(trailer.classList.contains(name)){
        trailer.classList.add('active')
    }
});

    const nextDescription = slideContent?.[name]?.description;
    if (contentParagraph && nextDescription) {
        contentParagraph.textContent = nextDescription;
    }

}


