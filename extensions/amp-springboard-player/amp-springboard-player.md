<!---
Copyright 2016 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# <a name="amp-springboard-player"></a> `amp-springboard-player`

<table>
  <tr>
    <td width="40%"><strong>Description</strong></td>
    <td>An <code>amp-springboard-player</code> displays the Springboard Player used in <a href="http://publishers.springboardplatform.com">Springboard</a> Video Platform.
  </tr>
  <tr>
    <td width="40%"><strong>Availability</strong></td>
    <td>Stable</td>
  </tr>
  <tr>
    <td width="40%"><strong>Required Script</strong></td>
    <td><code>&lt;script async custom-element="amp-springboard-player" src="https://cdn.ampproject.org/v0/amp-springboard-player-0.1.js">&lt;/script></code></td>
  </tr>
  <tr>
    <td width="40%"><strong>Examples</strong></td>
    <td><a href="https://github.com/ampproject/amphtml/blob/master/examples/springboard-player.amp.html">springboard-player.amp.html</a></td>
  </tr>
</table>

The following lists validation errors specific to the `amp-springboard-player` tag
(see also `amp-springboard-player` in the [AMP validator specification](https://github.com/ampproject/amphtml/blob/master/validator/validator.protoascii)):

<table>
  <tr>
    <th width="40%"><strong>Validation Error</strong></th>
    <th>Description</th>
  </tr>
  <tr>
    <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#tag-required-by-another-tag-is-missing">The 'example1' tag is missing or incorrect, but required by 'example2'.</a></td>
    <td>Error thrown when required <code>amp-springboard-player</code> extension <code>.js</code> script tag is missing or incorrect.</td>
  </tr>
  <tr>
    <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
    <td>Error thrown when <code>data-site-id</code> attribute is missing.</td>
  </tr>
  <tr>
      <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
      <td>Error thrown when <code>data-mode</code> attribute is missing.</td>
  </tr>
  <tr>
      <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
      <td>Error thrown when <code>data-content-id</code> attribute is missing.</td>
  </tr>
  <tr>
      <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
      <td>Error thrown when <code>data-player-id</code> attribute is missing.</td>
  </tr>
  <tr>
      <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
      <td>Error thrown when <code>data-domain</code> attribute is missing.</td>
  </tr>
  <tr>
      <td width="40%"><a href="https://www.ampproject.org/docs/reference/validation_errors.html#mandatory-attribute-missing">The mandatory attribute 'example1' is missing in tag 'example2'.</a></td>
      <td>Error thrown when <code>data-items</code> attribute is missing.</td>
  </tr>
  
</table>

## Example

The `width` and `height` attributes determine the aspect ratio of the player embedded in responsive layouts.

Examples:

```html
<amp-springboard-player
	data-site-id="261"
	data-mode="video"
	data-content-id="1578473"
	data-player-id="test401"
	data-domain="test.com"
	data-items="10"
	layout="responsive" width="480" height="270">
</amp-springboard-player>
```

## Attributes

**data-site-id**

The SpringBoard site id. Specific to every partner.

**data-mode**

The SpringBoard player mode (video|playlist).

**data-content-id**

The SpringBoard player content id (video or playlist id).

**data-player-id**

The Springboard player ID.

**data-domain**

The Springboard partner domain.

**data-items**

The number of videos in playlist
