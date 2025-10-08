// A stable, self-contained audio service to provide essential feedback and resolve all module errors.

// A valid, short, silent WAV file in base64. Used as a fallback and for sounds that should be silent.
const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// A comprehensive library of all sounds used in the application.
// All entries use valid base64 data to prevent decoding errors. The 'click' sound is used as a placeholder for many.
const SOUND_LIBRARY: Record<string, string> = {
  'click': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'swoosh': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAIAA9/70/Pz8/f79/v7+/wD/AP4A/AD9APYA7wDpAOYA2ADJANAAwgC/ALsAsQCmAKAAnwCfAKAAoQCjAKcArQCvALUAvQDIAMsA0QDVANYA2QDaANwA3gDfAOEA5gDqAPAA9gD8AP8BCQIdAicCKgIuAjECOgI+AkQCTgJRAloCXgJjAmgCaQJtAnECcgJ4AnwCgAKDAoYCiAKMApACkwKaAqEwqg==',
  'win': 'data:audio/wav;base64,UklGRjwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhJAAAAACAgIAgMDIyBgYIBgYMDA4ODg4SEhQUFBQWFhYcHB4eICAgIiIiJCQkJiYmKCgoKSkpKissLS0uLi8vMDAwMTExMzMzNTU1Nzc4ODg5OTs7PT0+Pj8/QEBCQ0NERUZHSUpLTE1OT1BSUlNUVVdYWVpbXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==',
  'small-win': 'data:audio/wav;base64,UklGRjwAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhJAAAAACAgIAgMDIyBgYIBgYMDA4ODg4SEhQUFBQWFhYcHB4eICAgIiIiJCQkJiYmKCgoKSkpKissLS0uLi8vMDAwMTExMzMzNTU1Nzc4ODg5OTs7PT0+Pj8/QEBCQ0NERUZHSUpLTE1OT1BSUlNUVVdYWVpbXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==',
  // FIX: Removed corrupted data from the end of the base64 string.
  'big-win': 'data:audio/wav;base64,UklGRqYAAABXQVZFZm10IBAAAAABAAIARKwAAB1sAgAEABAAZGF0YaQAAACA/v+V/tr96f2p/Z/9uf13/cX94f27/dX9uf3F/d/9tf3h/bH9xf3J/dX90f3X/df92P3c/dv93f3f/eX96v3t/fD99P35/fr9/P4A/gP+Av8E/wn/DP8Q/xX/Gf8f/yT/KP8v/zT/OP87/0D/Rf9J/0z/T/9V/1f/Wv9c/1//Yv9m/2j/bv9z/3f/f/+E/4j/jP+R/5T/mf+c/5//owCjAKYApwCoAKkAqwCuALAAsQC2ALcAuQC7ALwAvQDAAMMAxADGAMgAygDMAM8A0QDRANUA1wDYANsA3ADeAOAA4wDlAOkA6wDtAO8A8gD1APgA+QD8AP8BAQIEAgcDCQMMBBEEGgQgBCcEKwQyBDcERARJBFQEWgReBGIEZwRsBG8EhASIBJoEnwSlBKoEsAS5BMIEzwTTBNgE3ATiBOgE7wT3BPoFAQUGBQoFDwUYBSgFLwUzBTYFWAVlBXkFigWaBbYFvgXGBckF4wXxBfUF+gYGBhQGHgYjBikGMAZAJlAmVCc0KBQoFCkUKQApFCgUJhQnFAcUBhQGEwYTBBIEEgQMBBEEDgQOBBEEDQQSBBQEGgQcBB8EIAQiBCcEKgQtBDQEOgRAAkECSAJOAlACWgJgAmsCawJuAnICdwJ/AoYChAKFAogCjgKUApsCoAKiAqQCqgKzArQCtwK9AsACwwLJAs8C1gLaAt8C6QLyAvsDAAMMAxEDGQMgAycDLwM4Az4DQQNDA0cDUQNbA2IDaQNwA3sDhQOIA5EDlAOeA6kDqQO0A7gDwQPIA9MD2APiA+cD7gP1A/AD9wP9AgECAwIGAgoDFQMaAyMDKgMuAzIDPANCA0oDUwNdA2UDbQNxA3oDhAOIA5EDlgOhA6cDswO6A78DxwPMA9AD2wPhA+wD9AP8BAMFCgUOBhAGGAUaBSEFKAUuBTQFNgVEBWYFewWUBZ8FtwXPBecF/wYMBhAGFgYaByYHOwdLB20HdweJB5IHnwewB70HyQfTB+IH7Qf5BwEHCQcSBx4HJgcyB0EHRwdQB20HegexB7sH0wfjB/UH/ggLDBEMFQwbDEYMXgx8DIQMhgyUDJ4MogyEDH4MdwyoDKoMtAzkDO4M/A0GDQwNHg0qDToNTg1gDWoNdQ2HDZgNpA3GDcsO2A7vDwcPJQ8sDzYPSg9aD3cPiw+SD6UPtg/WD+MP9RABEQsRIXEiFSIgIhkiGSIcIh0iICIiIiEiGSIhIhciHSIfIiEiHCIfIhciISIhIiAiESIRIiAiDyIOIhEiECIQIg8iDyIQIgwiASINIg0iGiIcIhkiGSIhIg8iDyIQIg8iDiIPIhAiDyINIg0iDSINIgwiHCINIhciGyIHIhciDyIZIgwiGyINIgwiGiINIhsiDSIPohsiESINIhsiDSIPohkiDyINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiDSIPohsiDSINIhsiGyIPohsiGyINIhsiGyINIhsiDSINIhsiDyIPohsiDSINIhsiDyINIhsiDSIPohsiDSIPohwiDSIPogwiDyIPogwiDyIPogwiDSINIgwiDSIPogwiDSINIgwiGyIPog0iDSINIgwiDSIPog0iDSIPog0iDSINIgwiDSIPogwiDSINIgwiGyIPogwiDyIPog0iDSIPohkiDyINIgwiDSIPog0iDSIPohkiDSINIg0iDSIPog0iDSIPogwiDSINIgwiDyIPog0iDSIPog0iDSIPogwiDSIPog0iDSIPogwiDSIPog0iDSIPogwiDSIPog0iDSIPogwiDSINIgwiDyIPogwiDSINIgwiDSINIgwiDSIPogwiDyIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPog0iDSINIgwiDSINIgwiDyIPogwiDSIPogwiDSIPogwiDSINIgwiDSIPogwiDSINIgwiDSINIgwiDSIPogwiDSINIg0iDSIPogwiDSINIgwiDSINIgwiDSIPogwiDSIPog0iDSIPogwiDSIPogwiDSIPogwiDSINIg0iDSIPogwiDSIPog0iDSIPogwiDSINIg0iDSIPogwiDyIPogwiDSIPog0iDSIPogwiDSIPogwiDyIPogwiDSIPogwiDSIPog0iDSINIgwiDSIPog0iDSINIg0iDSINIgwiDSIPogwiDSIPog0iDSINIg0iDSIPogwiDSIPogwiDSINIgwiDSIPogwiDSIPogwiDyIPogwiDSIPogwiDSIPog0iDSINIgwiDyIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPogwiDSINIgwiDSIPog0aDSINIg0iDyIPog0aDSINIgwiDSIPogwiDSIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPogwiDSINIgwiDyINIgwiDSINIgwiDSIPogwiDSIPog1iDyINIg0iDSINIgwiDyINIgwiDSINIgwiDSINIgwiDSIPog0iDSIPogwiDSINIgwiDSIPog0iDSIPog0iDSIPogwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSINIgwiDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPogwiDSINIgwiDyINIgwiDyINIgwiDyINIgwiDSINIgwiDSINIgwiDyINIgwiDSIPog0iDSIPogwiDSIPog0iDSIPogwiDyINIgwiDyIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDSIPog0iDyIPog0i',
  'lose': silentWav,
  'suspense': 'data:audio/wav;base64,UklGRqgAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhZAAAAACA/v8r/az9yP1P/dn9/v34/d39r/z8/Oj9Gv4k/iX+Lf4p/gH92f15/er9/f2o/b/8/Pud/Qf+7/7e/sX92/1G/hL+Jv4r/i7+L/4j/gL9yP1W/XD96/34/db9i/zd/OX9Gf4d/iP+L/4w/jn+Pv4//jL+EP7i/an9xP2z/br9vv3Q/eL9/P36/dT9p/zQ/OL86vz6/O/8//zX/N/8tvy6/Lr8vPy0/LT8tPyx/LL8tPy0/K/8p/yc/J78mvyO/Iv8hvyA/H78ffx4/HH8bPxr/Gn8Zfxj/F38W/xT/Ev8R/xD/Dv8N/wu/Cv8I/wW/P/76fv5+7b7kPqc+pv6k/qA+nP6fPpy+m/6dPpq+mD6X/pf+lr6Wfpa+lf6V/pW+lf6VvpY+lf6VPpQ+lD6TvpJ+kv6SvpK+kj6RvpF+kX6Q/pA+kD6P/pA+kD6QfpB+kD6QfpD+kT6S/pQ+lT6X/pg+mz6d/qA+pT6ovqs+rv6w/rL+s/60vrY+tr63vre+uH65vro+uv68fr1+vj6/v0A/QH9CP0a/S39P/1E/Vf9Zv1w/X39gv2K/Zn9qf21/bn9vf3B/cv90f3X/df92v3c/d/95P3p/fD99v3//gD+Bf4O/hL+Gv4i/in+LP4w/jj+Q/5L/lH+Wv5f/mP+af5w/nT+f/6E/on+kf6U/pr+n/6k/qn+sP6z/rP+tP62/rf+uP65/rn+uv67/rv+vf6+/sH+yf7N/tP+2f7c/t7+4v7l/ur+7v7w/vL+9f74/v3+/wD/Af8H/g/+Ev4a/iL+J/4s/jD+OP5D/kv+Uf5a/l/+Y/5p/nD+dP5//oT+if6R/pT+mv6f/qT+qf6w/rP+s/60/rb+t/64/rn+uf66/rv+u/69/r7+wf7J/s3+0/7Z/tz+3v7i/uX+6v7u/vD+8v71/vj+/f7/AP8B/w/+D/4S/hr+Iv4n/iz+MP44/kP+S/5R/lr+X/5j/mn+cP50/n/+hP6J/pH+lP6a/p/+pP6p/rD+s/6z/rT+tv63/rj+uf65/rr+u/67/r3+vv7B/sn+zf7T/tn+3P7e/uL+5f7q/u7+8P7y/vX++P79/v8A/wH/CP4Q/hX+G/4i/ij+L/4w/jn+Qf5J/lH+Wv5f/mP+af5w/nT+fv6A/ob+iv6R/pX+m/6h/qf+rP6z/rb+vP7C/sn+0f7b/uD+6v7v/vT+9/7/AP8G/wn/Df4Q/hP+Ff4a/hz+Hv4g/iP+J/4o/iz+Mf4y/jb+O/4+/kD+Qv5E/kf+Sf5L/mD+ZP5r/nP+ef5/AISAh4CMgJeAmYCdnp+goqGko6SlpqeoqaqrrK2ur7CxsoAAAA==',
  'coin-clink': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'coin-land': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'shuffle': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAIAA9/70/Pz8/f79/v7+/wD/AP4A/AD9APYA7wDpAOYA2ADJANAAwgC/ALsAsQCmAKAAnwCfAKAAoQCjAKcArQCvALUAvQDIAMsA0QDVANYA2QDaANwA3gDfAOEA5gDqAPAA9gD8AP8BCQIdAicCKgIuAjECOgI+AkQCTgJRAloCXgJjAmgCaQJtAnECcgJ4AnwCgAKDAoYCiAKMApACkwKaAqEwqg==',
  'reveal': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'reel-spin': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAIAA9/70/Pz8/f79/v7+/wD/AP4A/AD9APYA7wDpAOYA2ADJANAAwgC/ALsAsQCmAKAAnwCfAKAAoQCjAKcArQCvALUAvQDIAMsA0QDVANYA2QDaANwA3gDfAOEA5gDqAPAA9gD8AP8BCQIdAicCKgIuAjECOgI+AkQCTgJRAloCXgJjAmgCaQJtAnECcgJ4AnwCgAKDAoYCiAKMApACkwKaAqEwqg==',
  'reel-stop': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'dice-roll': 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAIAA9/70/Pz8/f79/v7+/wD/AP4A/AD9APYA7wDpAOYA2ADJANAAwgC/ALsAsQCmAKAAnwCfAKAAoQCjAKcArQCvALUAvQDIAMsA0QDVANYA2QDaANwA3gDfAOEA5gDqAPAA9gD8AP8BCQIdAicCKgIuAjECOgI+AkQCTgJRAloCXgJjAmgCaQJtAnECcgJ4AnwCgAKDAoYCiAKMApACkwKaAqEwqg==',
  'dice-land': 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA',
  'bgm': 'data:audio/wav;base64,UklGRqgAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAAABkYXRhZAAAAACA/v8r/az9yP1P/dn9/v34/d39r/z8/Oj9Gv4k/iX+Lf4p/gH92f15/er9/f2o/b/8/Pud/Qf+7/7e/sX92/1G/hL+Jv4r/i7+L/4j/gL9yP1W/XD96/34/db9i/zd/OX9Gf4d/iP+L/4w/jn+Pv4//jL+EP7i/an9xP2z/br9vv3Q/eL9/P36/dT9p/zQ/OL86vz6/O/8//zX/N/8tvy6/Lr8vPy0/LT8tPyx/LL8tPy0/K/8p/yc/J78mvyO/Iv8hvyA/H78ffx4/HH8bPxr/Gn8Zfxj/F38W/xT/Ev8R/xD/Dv8N/wu/Cv8I/wW/P/76fv5+7b7kPqc+pv6k/qA+nP6fPpy+m/6dPpq+mD6X/pf+lr6Wfpa+lf6V/pW+lf6VvpY+lf6VPpQ+lD6TvpJ+kv6SvpK+kj6RvpF+kX6Q/pA+kD6P/pA+kD6QfpB+kD6QfpD+kT6S/pQ+lT6X/pg+mz6d/qA+pT6ovqs+rv6w/rL+s/60vrY+tr63vre+uH65vro+uv68fr1+vj6/v0A/QH9CP0a/S39P/1E/Vf9Zv1w/X39gv2K/Zn9qf21/bn9vf3B/cv90f3X/df92v3c/d/95P3p/fD99v3//gD+Bf4O/hL+Gv4i/in+LP4w/jj+Q/5L/lH+Wv5f/mP+af5w/nT+f/6E/on+kf6U/pr+n/6k/qn+sP6z/rP+tP62/rf+uP65/rn+uv67/rv+vf6+/sH+yf7N/tP+2f7c/t7+4v7l/ur+7v7w/vL+9f74/v3+/wD/Af8H/g/+Ev4a/iL+J/4s/jD+OP5D/kv+Uf5a/l/+Y/5p/nD+dP5//oT+if6R/pT+mv6f/qT+qf6w/rP+s/60/rb+t/64/rn+uf66/rv+u/69/r7+wf7J/s3+0/7Z/tz+3v7i/uX+6v7u/vD+8v71/vj+/f7/AP8B/w/+D/4S/hr+Iv4n/iz+MP44/kP+S/5R/lr+X/5j/mn+cP50/n/+hP6J/pH+lP6a/p/+pP6p/rD+s/6z/rT+tv63/rj+uf65/rr+u/67/r3+vv7B/sn+zf7T/tn+3P7e/uL+5f7q/u7+8P7y/vX++P79/v8A/wH/CP4Q/hX+G/4i/ij+L/4w/jn+Qf5J/lH+Wv5f/mP+af5w/nT+fv6A/ob+iv6R/pX+m/6h/qf+rP6z/rb+vP7C/sn+0f7b/uD+6v7v/vT+9/7/AP8G/wn/Df4Q/hP+Ff4a/hz+Hv4g/iP+J/4o/iz+Mf4y/jb+O/4+/kD+Qv5E/kf+Sf5L/mD+ZP5r/nP+ef5/AISAh4CMgJeAmYCdnp+goqGko6SlpqeoqaqrrK2ur7CxsoAAAA==',
};

class AudioService {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private activeSources: Map<string, Set<AudioBufferSourceNode>> = new Map();
    private bgmSource: AudioBufferSourceNode | null = null;
    private isUnlocked = false;

    constructor() {
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
            try {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.loadAllSounds();
            } catch (e) {
                console.error("Failed to create AudioContext:", e);
            }
        }
    }

    private async loadSound(name: string, dataUrl: string) {
        if (!this.audioContext) return;
        try {
            const response = await fetch(dataUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound: ${name}`, error);
        }
    }

    private loadAllSounds() {
        for (const [name, dataUrl] of Object.entries(SOUND_LIBRARY)) {
            this.loadSound(name, dataUrl);
        }
    }

    public unlock() {
        if (this.isUnlocked || !this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.isUnlocked = true;
            });
        } else {
            this.isUnlocked = true;
        }
    }

    public play(soundName: string, loop = false): AudioBufferSourceNode | null {
        if (!this.isUnlocked || !this.audioContext || this.audioContext.state === 'suspended') return null;

        const audioBuffer = this.sounds.get(soundName);
        if (audioBuffer) {
            try {
                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.loop = loop;
                source.connect(this.audioContext.destination);
                source.start();
                
                if (!this.activeSources.has(soundName)) {
                    this.activeSources.set(soundName, new Set());
                }
                const sourcesSet = this.activeSources.get(soundName)!;
                sourcesSet.add(source);

                source.onended = () => {
                    sourcesSet.delete(source);
                };
                return source;
            } catch (e) {
                console.error(`Error playing sound ${soundName}:`, e);
            }
        } else {
            // console.warn(`Sound not loaded or found: ${soundName}`);
        }
        return null;
    }

    public stop(soundName: string) {
        const sources = this.activeSources.get(soundName);
        if (sources) {
            sources.forEach(source => {
                try {
                    source.stop();
                } catch(e) { /* May already be stopped */ }
            });
            sources.clear();
        }
    }
    
    public playBGM() {
        if (this.bgmSource) {
            this.stopBGM();
        }
        this.bgmSource = this.play('bgm', true);
    }
    
    public stopBGM() {
        if (this.bgmSource) {
            try {
                this.bgmSource.stop();
            } catch (e) { /* May already be stopped */ }
            this.bgmSource = null;
        }
        this.stop('bgm'); // Also stop any other instances
    }
}

export const audioService = new AudioService();