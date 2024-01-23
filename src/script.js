/* global patterns */

const featureDetectionMap = {};
for (let featureName in patterns) {
    const feature = patterns[featureName];
    featureDetectionMap[feature.chromeStatusID] = feature;
    featureDetectionMap[feature.chromeStatusID].name = featureName;
}

const cards = document.querySelectorAll('.card');
Array.from(cards).forEach((card) => {
    const chromiumId = Number(card.dataset.chromiumId);
    if (!chromiumId) {
        setStatus(card, 'Unknown');
        return;
    }

    const feature = featureDetectionMap[chromiumId];
    if (!feature) {
        setStatus(card, 'Unknown');
        return;
    }

    processFeature(feature, card);
});

async function processFeature(feature, card) {
    try {
        const isSupported = await feature.supported;
        if (isSupported) {
            setStatus(card, 'Yes');
            card.classList.add('card--success');
        } else {
            setStatus(card, 'No');
            card.classList.add('card--fail');
        }
    } catch (e) {
        setStatus(card, 'Unknown');
    }
}

function setStatus(card, status) {
    card.querySelector('.card__status').innerHTML = status;
}
